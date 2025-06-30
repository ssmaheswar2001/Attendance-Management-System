# Auto-Deployment Setup Guide

This guide will help you set up automatic deployment from GitHub to your EC2 instance.

## 🎯 **What This Does**

- **Automatic Deployment**: Every time you push to the `main` branch, your EC2 instance automatically pulls changes and redeploys
- **Zero Downtime**: Your application stays running during updates
- **Rollback Capability**: Easy to revert if something goes wrong

## 📋 **Prerequisites**

- ✅ GitHub repository with your code
- ✅ EC2 instance running your application
- ✅ SSH access to EC2 instance
- ✅ Docker and Docker Compose installed on EC2

## 🚀 **Step-by-Step Setup**

### **Step 1: Generate SSH Key for GitHub Actions**

On your EC2 instance, run:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@attendance-app.com" -f ~/.ssh/github_actions

# Add to authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub

# Display private key (copy this)
cat ~/.ssh/github_actions
```

### **Step 2: Add GitHub Secrets**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

#### **EC2_HOST**
- **Name**: `EC2_HOST`
- **Value**: Your EC2 public IP or domain (e.g., `attendance-app.com`)

#### **EC2_USERNAME**
- **Name**: `EC2_USERNAME`
- **Value**: `ubuntu` (or your EC2 username)

#### **EC2_SSH_KEY**
- **Name**: `EC2_SSH_KEY`
- **Value**: The private key content from Step 1

### **Step 3: Test the Setup**

On your EC2 instance:

```bash
cd ~/Attendance-Management-System
chmod +x test-deployment.sh
./test-deployment.sh
```

### **Step 4: Trigger First Deployment**

Push your changes to GitHub:

```bash
git add .
git commit -m "Add auto-deployment workflow"
git push origin main
```

## 🔍 **Monitor Deployment**

1. **GitHub Actions Tab**: Check the "Actions" tab in your repository
2. **EC2 Logs**: Monitor deployment on your EC2 instance
3. **Application**: Test your application at `https://attendance-app.com`

## 🛠️ **Manual Deployment**

If you need to deploy manually:

```bash
# On EC2 instance
cd ~/Attendance-Management-System
git pull origin main
docker-compose down
docker-compose up -d --build
```

## 🔧 **Troubleshooting**

### **SSH Connection Issues**
```bash
# Test SSH connection
ssh -i ~/.ssh/github_actions ubuntu@your-ec2-ip
```

### **Permission Issues**
```bash
# Fix SSH key permissions
chmod 600 ~/.ssh/github_actions
chmod 700 ~/.ssh
```

### **Docker Issues**
```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker if needed
sudo systemctl restart docker
```

### **Git Issues**
```bash
# Check git configuration
git config --list

# Set up git if needed
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📊 **Deployment Flow**

1. **Push to GitHub** → Triggers GitHub Actions
2. **GitHub Actions** → Connects to EC2 via SSH
3. **EC2 Script** → Pulls latest changes
4. **Docker** → Rebuilds and restarts containers
5. **Health Check** → Verifies application is running

## 🔄 **Rollback Process**

If deployment fails:

```bash
# On EC2 instance
cd ~/Attendance-Management-System

# Check git log
git log --oneline -5

# Revert to previous commit
git reset --hard HEAD~1

# Redeploy
docker-compose down
docker-compose up -d --build
```

## 📈 **Benefits**

- ✅ **Automated**: No manual deployment needed
- ✅ **Consistent**: Same deployment process every time
- ✅ **Trackable**: Full deployment history in GitHub Actions
- ✅ **Reliable**: Built-in error handling and rollback
- ✅ **Secure**: Uses SSH keys for authentication

## 🎉 **You're All Set!**

Once configured, every push to the `main` branch will automatically deploy to your EC2 instance. Your application will always be up-to-date with the latest changes! 