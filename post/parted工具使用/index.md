# Parted工具使用


<!--more-->

<font color=red size="5">注意parted分区工具不像fdisk那样需要保存才会生效,而是实时生效,操作需谨慎</font>

## 1. 操作sdb磁盘
```bash
parted /dev/sdb
```

## 2. 修改磁盘的分区表为gpt
```bash
(parted) mklabel gpt
```
> 类型是以下其中之一
> 
> "aix", "amiga","bsd", "dvh", "gpt", "loop", "mac", "msdos", "pc98", "sun".

## 3. 创建分区
```bash
# 完全使用磁盘大小
(parted) mkpart data 0% 100%

# 分配指定大小(从第一个扇区开始到1024M的位置，也就是1个G)
# (parted) mkpart data 1 1024M

```
> 命令参数: mkpart[part-type name fs-type] start end
> 
> `part-type` 当分区表是msdos、dvh时才需要使用这个参数,可选项是"primary", "logical", "extended".
> 
> `name` 当分区表是GPT时，可以指定name，非必须的
> 
> `fs-type` 可选项，指定文件系统类型 "btrfs", "ext2", "ext3", "ext4", "fat16", "fat32", "hfs", "hfs+", "linux-swap", "ntfs", "reiserfs", "udf", "xfs". 暂时没用到
>
> `start` 和 `stop` 分区起始结束位置。
> 
> 使用百分比指定。例如，0% 表示分区的起始位置是硬盘的第0个扇区，50% 表示分区的起始位置是硬盘的一半。
> 
> 使用数字指定。例如，2048 表示分区的起始位置是硬盘的第2048个扇区，建议从1开始指定。
> 
> 使用单位指定。例如，100MB 表示分区的起始位置是硬盘的第 100MB 位置。


## 4. 查看分区
```bash
(parted) p                                                                
Model: VMware, VMware Virtual S (scsi)
Disk /dev/sdb: 53.7GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags: 

Number  Start   End     Size    File system  Name  Flags
 1      1049kB  53.7GB  53.7GB               data
```

## 5. 退出
```bash
(parted) q
```

## 6. 格式化分区
```bash
mkfs.xfs /dev/sdb1 
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/parted%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/  

