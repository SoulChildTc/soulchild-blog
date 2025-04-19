# 基于 MCP SSE 实现 AI 对接天气服务


<!--more-->

### server 实现

```go
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// 存储认证信息到上下文的 key
type authKey struct{}

// 从 http.Request 中获取 Authorization 的值, 设置到上下文,  key: authKey{} value: 认证信息
func authFromRequest(ctx context.Context, r *http.Request) context.Context {
	return context.WithValue(ctx, authKey{}, r.Header.Get("Authorization"))
}

var (
	// 和风天气API密钥, 优先从环境变量 QWEATHER_API_KEY 读取
	qweatherAPIKey = getEnv("QWEATHER_API_KEY", "")
	// 和风天气基础URL, 优先从环境变量 QWEATHER_BASE_URL 读取
	qweatherBaseURL = getEnv("QWEATHER_BASE_URL", "https://xxx")
	// 创建可重用的HTTP客户端
	httpClient = &http.Client{}
)

// Helper function to get environment variable or default value
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// --- Weather API Structs ---

type WeatherResponse struct {
	Code string     `json:"code"`
	Now  WeatherNow `json:"now"`
}

type WeatherNow struct {
	ObsTime   string `json:"obsTime"`   // 数据观测时间
	Temp      string `json:"temp"`      // 温度
	FeelsLike string `json:"feelsLike"` // 体感温度
	Icon      string `json:"icon"`      // 天气状况图标代码
	Text      string `json:"text"`      // 天气状况文字描述
	Wind360   string `json:"wind360"`   // 风向360角度
	WindDir   string `json:"windDir"`   // 风向
	WindScale string `json:"windScale"` // 风力等级
	WindSpeed string `json:"windSpeed"` // 风速，公里/小时
	Humidity  string `json:"humidity"`  // 相对湿度
	Precip    string `json:"precip"`    // 当前小时降水量，毫米
	Pressure  string `json:"pressure"`  // 大气压强，百帕
	Vis       string `json:"vis"`       // 能见度，公里
	Cloud     string `json:"cloud"`     // 云量 (可能为空)
	Dew       string `json:"dew"`       // 露点温度 (可能为空)
}

// --- Geo API Structs ---

type GeoResponse struct {
	Code     string         `json:"code"`
	Location []LocationInfo `json:"location"`
}

type LocationInfo struct {
	Name string `json:"name"`
	ID   string `json:"id"`
	Lat  string `json:"lat"`
	Lon  string `json:"lon"`
	Adm1 string `json:"adm1"` // 省份
	Adm2 string `json:"adm2"` // 城市
}

// 从上下文中提取认证信息
func tokenFromContext(ctx context.Context) (string, error) {
	auth, ok := ctx.Value(authKey{}).(string)
	if !ok {
		return "", fmt.Errorf("missing auth")
	}
	return auth, nil
}

// --- Helper Function for API Calls ---

// callQweatherAPI 是调用和风天气 API 的通用函数
func callQweatherAPI(ctx context.Context, apiPath string, params url.Values) ([]byte, error) {
	// 添加 key 参数
	params.Set("key", qweatherAPIKey)

	// 构建完整 URL
	fullURL := fmt.Sprintf("%s%s?%s", qweatherBaseURL, apiPath, params.Encode())

	// 创建请求
	req, err := http.NewRequestWithContext(ctx, "GET", fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("创建 API 请求失败 (%s): %w", apiPath, err)
	}

	// 发送请求
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("发送 API 请求失败 (%s): %w", apiPath, err)
	}
	defer resp.Body.Close()

	// 读取响应体
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取 API 响应失败 (%s): %w", apiPath, err)
	}

	// 检查 HTTP 状态码
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API 请求失败 (%s)，状态码: %d, 响应: %s", apiPath, resp.StatusCode, string(body))
	}

	return body, nil
}

func getCurrentWeatherHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	location, ok := request.Params.Arguments["location"].(string)
	if !ok || location == "" {
		return nil, errors.New("location 参数不能为空")
	}

	// 使用通用函数调用 API
	params := url.Values{}
	params.Set("location", location)
	body, err := callQweatherAPI(ctx, "/v7/weather/now", params)
	if err != nil {
		return nil, err // 错误已在 callQweatherAPI 中格式化
	}

	// 解析JSON响应
	var weatherResp WeatherResponse
	err = json.Unmarshal(body, &weatherResp)
	if err != nil {
		return nil, fmt.Errorf("解析天气响应 JSON 失败: %w, 原始响应: %s", err, string(body))
	}

	// 检查API业务状态码
	if weatherResp.Code != "200" {
		return nil, fmt.Errorf("天气 API 业务错误，代码: %s, 原始响应: %s", weatherResp.Code, string(body))
	}

	// 格式化输出
	now := weatherResp.Now
	// 更新格式化字符串以包含更多信息
	resultText := fmt.Sprintf("观测时间：%s\n天气：%s，气温：%s℃ (体感 %s℃)\n风：%s %s级 (%s km/h)\n湿度：%s%%，降水：%s mm，气压：%s hPa\n能见度：%s km",
		now.ObsTime, // 添加观测时间
		now.Text, now.Temp, now.FeelsLike,
		now.WindDir, now.WindScale, now.WindSpeed, // 添加风速
		now.Humidity, now.Precip, now.Pressure, // 添加降水和气压
		now.Vis) // 添加能见度

	return mcp.NewToolResultText(resultText), nil
}

func getGeoHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	city, ok := request.Params.Arguments["city"].(string)
	if !ok || city == "" {
		return nil, errors.New("city 参数不能为空")
	}

	// 使用通用函数调用 API
	params := url.Values{}
	params.Set("location", city)
	body, err := callQweatherAPI(ctx, "/geo/v2/city/lookup", params)
	if err != nil {
		return nil, err // 错误已在 callQweatherAPI 中格式化
	}

	// 解析JSON响应
	var geoResp GeoResponse
	err = json.Unmarshal(body, &geoResp)
	if err != nil {
		return nil, fmt.Errorf("解析地理位置响应 JSON 失败: %w, 原始响应: %s", err, string(body))
	}

	// 检查API业务状态码
	if geoResp.Code != "200" {
		return nil, fmt.Errorf("地理位置 API 业务错误，代码: %s, 原始响应: %s", geoResp.Code, string(body))
	}

	if len(geoResp.Location) == 0 {
		return nil, fmt.Errorf("未找到指定城市 '%s' 的地理位置信息", city)
	}

	// 格式化输出 (通常返回第一个匹配项)
	loc := geoResp.Location[0]
	resultText := fmt.Sprintf("城市：%s (%s, %s), 经度: %s, 纬度: %s, ID: %s",
		loc.Name, loc.Adm2, loc.Adm1, loc.Lon, loc.Lat, loc.ID)

	return mcp.NewToolResultText(resultText), nil
}

// 新增：智能天气查询处理函数
func getSmartWeatherHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	query, ok := request.Params.Arguments["query"].(string)
	if !ok || query == "" {
		return nil, errors.New("query 参数不能为空")
	}

	// token, err := tokenFromContext(ctx)
	// if err != nil || token != "soulchild" {
	// 	return nil, fmt.Errorf("用户认证失败")
	// }

	var locationCoords string
	// var err error

	// 检查 query 是否包含逗号，判断是城市名还是经纬度
	if strings.Contains(query, ",") {
		// 认为是经纬度
		locationCoords = query
	} else {
		// 认为是城市名，先获取经纬度
		geoParams := url.Values{}
		geoParams.Set("location", query)
		geoBody, geoErr := callQweatherAPI(ctx, "/geo/v2/city/lookup", geoParams)
		if geoErr != nil {
			return nil, fmt.Errorf("智能查询：获取 '%s' 的地理位置失败: %w", query, geoErr)
		}

		var geoResp GeoResponse
		if err = json.Unmarshal(geoBody, &geoResp); err != nil {
			return nil, fmt.Errorf("智能查询：解析 '%s' 的地理位置响应 JSON 失败: %w, 原始响应: %s", query, err, string(geoBody))
		}

		if geoResp.Code != "200" {
			return nil, fmt.Errorf("智能查询：地理位置 API 业务错误 (城市: %s)，代码: %s, 原始响应: %s", query, geoResp.Code, string(geoBody))
		}

		if len(geoResp.Location) == 0 {
			return nil, fmt.Errorf("智能查询：未找到城市 '%s' 的地理位置信息", query)
		}

		// 使用第一个匹配到的位置
		loc := geoResp.Location[0]
		locationCoords = fmt.Sprintf("%s,%s", loc.Lon, loc.Lat)
	}

	// --- 获取天气信息 --- (无论输入是城市还是坐标，现在都有了 locationCoords)
	weatherParams := url.Values{}
	weatherParams.Set("location", locationCoords)
	body, err := callQweatherAPI(ctx, "/v7/weather/now", weatherParams)
	if err != nil {
		// 如果是地理位置查询失败导致的错误，之前的错误信息可能更具体
		if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
			return nil, err
		}
		return nil, fmt.Errorf("智能查询：获取坐标 '%s' 的天气失败: %w", locationCoords, err)
	}

	// 解析天气 JSON 响应
	var weatherResp WeatherResponse
	err = json.Unmarshal(body, &weatherResp)
	if err != nil {
		return nil, fmt.Errorf("智能查询：解析天气响应 JSON 失败: %w, 原始响应: %s", err, string(body))
	}

	if weatherResp.Code != "200" {
		return nil, fmt.Errorf("智能查询：天气 API 业务错误 (坐标: %s)，代码: %s, 原始响应: %s", locationCoords, weatherResp.Code, string(body))
	}

	// 格式化天气输出
	now := weatherResp.Now
	resultText := fmt.Sprintf("查询地点：%s\n观测时间：%s\n天气：%s，气温：%s℃ (体感 %s℃)\n风：%s %s级 (%s km/h)\n湿度：%s%%，降水：%s mm，气压：%s hPa\n能见度：%s km",
		query, // 显示用户原始查询
		now.ObsTime,
		now.Text, now.Temp, now.FeelsLike,
		now.WindDir, now.WindScale, now.WindSpeed,
		now.Humidity, now.Precip, now.Pressure,
		now.Vis)

	return mcp.NewToolResultText(resultText), nil
}

func main() {
	mcpServer := server.NewMCPServer(
		"weather-server",
		"1.0.0",
		server.WithResourceCapabilities(true, true),
		server.WithPromptCapabilities(true),
		server.WithToolCapabilities(true),
	)

	// --- Tool Definitions ---
	weatherTool := mcp.NewTool("get_current_weather",
		mcp.WithDescription("获取指定经纬度的当前天气信息"),
		mcp.WithString("location",
			mcp.Description("位置坐标，格式为 经度,纬度 例如 116.41,39.92"),
		),
	)

	geoTool := mcp.NewTool("get_geo",
		mcp.WithDescription("获取城市名称对应的位置坐标信息"),
		mcp.WithString("city",
			mcp.Description("城市名称, 例如 北京"),
		),
	)

	smartWeatherTool := mcp.NewTool("get_smart_weather",
		mcp.WithDescription("智能查询天气，自动识别城市名称或经纬度坐标"),
		mcp.WithString("query",
			mcp.Description("查询条件，可以是城市名称（如 北京）或经纬度坐标（如 116.41,39.92）"),
		),
	)

	// --- Add Tool Handlers ---
	mcpServer.AddTool(weatherTool, getCurrentWeatherHandler)
	mcpServer.AddTool(geoTool, getGeoHandler)
	mcpServer.AddTool(smartWeatherTool, getSmartWeatherHandler)

	// create sse server
	sseServer := server.NewSSEServer(mcpServer,
		server.WithBaseURL("http://localhost:8080"),
		server.WithBasePath("/weather"),
		// 使用 authFromRequest 作为 SSE 上下文函数, 请求进入的时候可以执行 authFromRequest 设置上下文内容, 实现认证信息的传递
		server.WithSSEContextFunc(authFromRequest),
	)

	// start sse server
	log.Printf("SSE server listening on :8080")
	if err := sseServer.Start(":8080"); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

/*
  mcp client 配置
	"weather-sse-server": {
		"url": "http://localhost:8080/weather/sse"
	}
*/

```

### client 本地测试

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/mark3labs/mcp-go/client"
	"github.com/mark3labs/mcp-go/mcp"
)

func main() {
	c, err := client.NewSSEMCPClient("http://localhost:8080/weather/sse",
		client.WithHeaders(map[string]string{
			"Authorization": "soulchild",
		}),
	)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer c.Close()

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := c.Start(ctx); err != nil {
		log.Fatalf("Failed to start client: %v", err)
	}

	// Initialize the client
	fmt.Println("Initializing client...")
	initRequest := mcp.InitializeRequest{}
	initRequest.Params.ProtocolVersion = mcp.LATEST_PROTOCOL_VERSION
	initRequest.Params.ClientInfo = mcp.Implementation{
		Name:    "weather-client",
		Version: "1.0.0",
	}

	initResult, err := c.Initialize(ctx, initRequest)
	if err != nil {
		log.Fatalf("Failed to initialize: %v", err)
	}
	fmt.Printf(
		"Initialized with server: %s %s\n\n",
		initResult.ServerInfo.Name,
		initResult.ServerInfo.Version,
	)

	// List Tools
	fmt.Println("Listing available tools...")
	toolsRequest := mcp.ListToolsRequest{}
	tools, err := c.ListTools(ctx, toolsRequest)
	if err != nil {
		log.Fatalf("Failed to list tools: %v", err)
	}
	for _, tool := range tools.Tools {
		fmt.Printf("- %s: %s\n", tool.Name, tool.Description)
	}
	fmt.Println()

	// call tool
	fmt.Println("Call get_smart_weather...")
	listTmpRequest := mcp.CallToolRequest{}
	listTmpRequest.Params.Name = "get_smart_weather"
	listTmpRequest.Params.Arguments = map[string]interface{}{
		"query": "上海",
	}
	result, err := c.CallTool(ctx, listTmpRequest)
	if err != nil {
		log.Fatalf("Failed to list directory: %v", err)
	}
	printToolResult(result)
	fmt.Println()
}

// Helper function to print tool results
func printToolResult(result *mcp.CallToolResult) {
	for _, content := range result.Content {
		if textContent, ok := content.(mcp.TextContent); ok {
			fmt.Println(textContent.Text)
		} else {
			jsonBytes, _ := json.MarshalIndent(content, "", "  ")
			fmt.Println(string(jsonBytes))
		}
	}
}

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/745047127/  

