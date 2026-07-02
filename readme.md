# Multi-Tier Cloud Infrastructure & Automated CI/CD Pipeline

A high-performance, automated web application architecture deployed on a bare-metal AWS EC2 environment. This system utilizes Nginx as an edge reverse proxy to optimize the separation of concerns between static file delivery and dynamic API compute processes.

Live Application URL: `http://32.195.56.203/`  
Live API Data Endpoint: `http://32.195.56.203/api/data`

---

## 🏛️ System Architecture

The production environment separates static front-end assets from logical back-end compute engines to ensure optimal throughput, low-latency resource processing, and process resilience.

* **Edge Tier (Nginx):** Nginx listens on Port 80, serving static web assets natively from the local disk memory maps.
* **Application Compute Tier (Node.js):** Dynamic `/api` traffic blocks are caught by Nginx and proxied upstream internally to a native Node.js application engine running on Port 8080.
* **Process Management:** The background Node runtime lifecycle is managed permanently by **PM2** to guarantee zero-downtime persistence and automatic crash recovery.

---

## 🚀 CI/CD Pipeline Configuration

Continuous Integration and Continuous Deployment are fully orchestrated via GitHub Actions. Every push to the `main` branch triggers an automated, secure remote deployment lifecycle.

### Active Pipeline Steps (`.github/workflows/deploy.yml`)
1. **Source Checkout:** Pulls down the latest version of repository assets using `actions/checkout@v4`.
2. **Secure Remote Connection:** Establishes a secure connection to the AWS EC2 container layer via an automated SSH channel using `appleboy/ssh-action@master` and stored encryption keys.
3. **Environment Alignment:** Forces non-interactive shell sessions to cleanly map system paths and enforce environment resolution handles.
4. **Automated Process Lifecycle:** Evaluates active process tables via PM2; automatically executing a live, zero-downtime `reload` if the application is running, or initiating a raw `start` thread block if it is initialized cleanly.
5. **Web Engine Optimization:** Runs an Nginx configuration validation check (`nginx -t`) and reloads the routing tables.

---

## 🛠️ Complete Deployment & Setup Steps

### 1. Host Infrastructure Configuration (AWS Console)
* Provision an EC2 Ubuntu Server instance (`32.195.56.203`).
* Create and attach an IAM Role containing `CloudWatchAgentServerPolicy` and `AmazonS3FullAccess` to the instance platform to allow monitoring and logging compliance.
* Adjust your Security Group rules to permit inbound TCP traffic on Port 80 (HTTP) and Port 22 (SSH).

### 2. GitHub Secrets Integration
Configure the following encrypted keys inside your GitHub Repository under **Settings** -> **Secrets and variables** -> **Actions**:
* `EC2_HOST`: `32.195.56.203`
* `EC2_USERNAME`: `ubuntu`
* `EC2_SSH_KEY`: The raw, unencrypted contents of your private configuration `.pem` file.

### 3. Server Node Preparation (EC2 Terminal)
Execute these baseline commands to register the Node runtime engine and Nginx natively:
```bash
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install pm2 -g
sudo chmod +x /home/ubuntu