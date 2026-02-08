#!/bin/bash
cd /Users/akieiamoniquedavis/Desktop/DigitalBloom_Project_Archive/Archive/flower-shop/

echo "Installing app dependencies..."
npm install

echo "Starting Digital Bloom App..."
echo "1. Starting Backend API (Port 3001)..."
npm run backend > backend.log 2>&1 &
echo "2. Starting Frontend (Port 5173)..."
echo "Click the link that appears: http://localhost:5173"
npm run dev
