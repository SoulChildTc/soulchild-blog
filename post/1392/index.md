# zabbix4.0编译安装参数

<!--more-->
官方文档：

https://www.zabbix.com/documentation/4.0/zh/manual/installation/install
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-markup">Optional Packages:
  --with-PACKAGE[=ARG]    use PACKAGE [ARG=yes]
  --without-PACKAGE       do not use PACKAGE (same as --with-PACKAGE=no)
  --with-ibm-db2[=ARG]    use IBM DB2 CLI from given sqllib directory
                          (ARG=path); use /home/db2inst1/sqllib (ARG=yes);
                          disable IBM DB2 support (ARG=no)
  --with-ibm-db2-include[=DIR]
                          use IBM DB2 CLI headers from given path
  --with-ibm-db2-lib[=DIR]
                          use IBM DB2 CLI libraries from given path
  --with-mysql[=ARG]      use MySQL client library [default=no], optionally
                          specify path to mysql_config
  --with-oracle[=ARG]     use Oracle OCI API from given Oracle home
                          (ARG=path); use existing ORACLE_HOME (ARG=yes);
                          disable Oracle OCI support (ARG=no)
  --with-oracle-include[=DIR]
                          use Oracle OCI API headers from given path
  --with-oracle-lib[=DIR] use Oracle OCI API libraries from given path
  --with-postgresql[=ARG] use PostgreSQL library [default=no], optionally
                          specify path to pg_config
  --with-sqlite3[=ARG]    use SQLite 3 library [default=no], optionally
                          specify the prefix for sqlite3 library

If you want to use Jabber protocol for messaging:
  --with-jabber[=DIR]     Include Jabber support [default=no]. DIR is the
                          iksemel library install directory.

If you want to use XML library:
  --with-libxml2[=ARG]    use libxml2 client library [default=no], optionally
                          specify path to xml2-config

If you want to use unixODBC library:
  --with-unixodbc[=ARG]   use ODBC driver against unixODBC package
                          [default=no], optionally specify full path to
                          odbc_config binary.

If you want to use Net-SNMP library:
  --with-net-snmp[=ARG]   use Net-SNMP package [default=no], optionally
                          specify path to net-snmp-config

If you want to use SSH2 based checks:
  --with-ssh2[=DIR]       use SSH2 package [default=no], DIR is the SSH2
                          library install directory.

If you want to check IPMI devices:
  --with-openipmi[=DIR]   Include OPENIPMI support [default=no]. DIR is the
                          OPENIPMI base install directory, default is to
                          search through a number of common places for the
                          OPENIPMI files.

If you want to specify zlib installation directories:
  --with-zlib=DIR         use zlib from given base install directory (DIR),
                          default is to search through a number of common
                          places for the zlib files.
  --with-zlib-include=DIR use zlib include headers from given path.
  --with-zlib-lib=DIR     use zlib libraries from given path.

If you want to specify pthread installation directories:
  --with-libpthread[=DIR] use libpthread from given base install directory
                          (DIR), default is to search through a number of
                          common places for the libpthread files.
  --with-libpthread-include[=DIR]
                          use libpthread include headers from given path.
  --with-libpthread-lib[=DIR]
                          use libpthread libraries from given path.

If you want to specify libevent installation directories:
  --with-libevent[=DIR]   use libevent from given base install directory
                          (DIR), default is to search through a number of
                          common places for the libevent files.
  --with-libevent-include[=DIR]
                          use libevent include headers from given path.
  --with-libevent-lib[=DIR]
                          use libevent libraries from given path.

If you want to use encryption provided by mbed TLS (PolarSSL) library:
  --with-mbedtls[=DIR]    use mbed TLS (PolarSSL) package [default=no], DIR is
                          the libpolarssl install directory.

If you want to use encryption provided by GnuTLS library:
  --with-gnutls[=DIR]     use GnuTLS package [default=no], DIR is the
                          libgnutls install directory.

If you want to use encryption provided by OpenSSL library:
  --with-openssl[=DIR]    use OpenSSL package [default=no], DIR is the libssl
                          and libcrypto install directory.

If you want to check LDAP servers:
  --with-ldap[=DIR]       Include LDAP support [default=no]. DIR is the LDAP
                          base install directory, default is to search through
                          a number of common places for the LDAP files.

If you want to use cURL library:
  --with-libcurl[=DIR]    use cURL package [default=no], optionally specify
                          path to curl-config

If you want to specify libpcre installation directories:
  --with-libpcre[=DIR]    use libpcre from given base install directory (DIR),
                          default is to search through a number of common
                          places for the libpcre files.
  --with-libpcre-include[=DIR]
                          use libpcre include headers from given path.
  --with-libpcre-lib[=DIR]
                          use libpcre libraries from given path.

If you want to specify iconv installation directories:
  --with-iconv[=DIR]      use iconv from given base install directory (DIR),
                          default is to search through a number of common
                          places for the iconv files.
  --with-iconv-include[=DIR]
                          use iconv include headers from given path.
  --with-iconv-lib[=DIR]  use iconv libraries from given path.

Some influential environment variables:
  CC          C compiler command
  CFLAGS      C compiler flags
  LDFLAGS     linker flags, e.g. -L if you have libraries in a
              nonstandard directory 
  LIBS        libraries to pass to the linker, e.g. -l
  CPPFLAGS    (Objective) C/C++ preprocessor flags, e.g. -I if
              you have headers in a nonstandard directory 
  CPP         C preprocessor
  PKG_CONFIG  path to pkg-config utility
  PKG_CONFIG_PATH
              directories to add to pkg-config's search path
  PKG_CONFIG_LIBDIR
              path overriding pkg-config's built-in search path
  IKSEMEL_CFLAGS
              C compiler flags for IKSEMEL, overriding pkg-config
  IKSEMEL_LIBS
              linker flags for IKSEMEL, overriding pkg-config
</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1392/  

