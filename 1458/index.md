# gradle打包APK,并使用jarsigner签名

<!--more-->
1.安装jdk环境

https://soulchild.cn/470.html

&nbsp;

2.安装android sdk

wget https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip

mkdir -p /opt/android/sdk

unzip sdk-tools-linux-3859397.zip -d /opt/android/sdk

cd /opt/android/sdk/tools/bin/

./sdkmanager "build-tools;27.0.3" "platforms;android-27" "platform-tools" "ndk-bundle" "extras;android;m2repository" "extras;google;m2repository" "extras;m2repository;com;android;support;constraint;constraint-layout;1.0.2" "tools"

or

./sdkmanager --licenses

&nbsp;

&nbsp;

3.安装gradle

wget https://services.gradle.org/distributions/gradle-5.1.1-all.zip

mkdir /opt/gradle/

unzip gradle-5.1.1-all.zip -d /opt/gradle/

&nbsp;
<div class="cnblogs_code">

配置环境变量

export ANDROID_HOME=/opt/android/sdk
PATH=$PATH:$ANDROID_HOME:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/tools/bin
export PATH=$PATH:/opt/gradle/gradle-5.1.1/bin

</div>
&nbsp;

4.生成签名文件

mkdir ~/keys

cd ~/keys

keytool -genkey -v -keystore dao_flashcard.keystore -alias flashcard -keyalg RSA -validity 20000

参数说明：

1）keytool是工具名称，-genkey意味着执行的是生成数字证书操作，-v表示将生成证书的详细信息打印出来
2）dao_flashcard.keystore表示生成的数字证书的文件名为“dao_flashcard.keystore”；
3）-alias flashcard表示证书的别名为“flashcard"，当然可以不和上面的文件名一样；
4）-keyalg RSA 表示生成密钥文件所采用的算法为RSA；
5）-validity 20000 表示该数字证书的有效期为20000天，意味着20000天之后该证书将失效

&nbsp;

5.构建apk包

cd /android_app/

gradle clean

gradle assembleRelease

cp app/build/outputs/apk/release/xxx.apk ~/keys

&nbsp;

6.给apk签名

#apk和签名文件在同一目录

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dao_flashcard.keystore -signedjar new.apk xxx.apk flashcard


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1458/  

