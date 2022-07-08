## connect ssh
ssh admin@app-40664.nuvem-us-02.absamcloud.com -p 20464

## deploy
tar -czf app.tar.gz server
scp -P 20464 app.tar.gz admin@app-40664.nuvem-us-02.absamcloud.com:/home/admin