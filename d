[0;1;32m●[0m nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: [0;1;32mactive (running)[0m since Fri 2021-10-01 12:41:11 UTC; 2 months 28 days ago
     Docs: man:nginx(8)
 Main PID: 28442 (nginx)
    Tasks: 3 (limit: 1109)
   CGroup: /system.slice/nginx.service
           ├─  534 nginx: worker process
           ├─  535 nginx: worker process
           └─28442 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;

Oct 01 12:41:11 ip-172-31-55-177 systemd[1]: Starting A high performance web server and a reverse proxy server...
Oct 01 12:41:11 ip-172-31-55-177 systemd[1]: nginx.service: Failed to parse PID from file /run/nginx.pid: Invalid argument
Oct 01 12:41:11 ip-172-31-55-177 systemd[1]: Started A high performance web server and a reverse proxy server.
