# 🌸 Quick Guide: Add Your Flower Arrangements

## 🚀 **Super Simple Steps**

---

## **Step 1: Start Your Website**

Open Terminal and run these commands:

```bash
cd ~/Desktop/flower-shop
npm run dev
```

**In a new Terminal tab:**
```bash
cd ~/Desktop/flower-shop
npm run backend
```

✅ **Your site is now running!**

---

## **Step 2: Open Admin Panel**

In your browser, go to:
```
http://localhost:5173/admin
```

You'll see all your products and an **"+ Add New Product"** button.

---

## **Step 3: Add Each Arrangement**

### Click **"+ Add New Product"**

Fill in the form:

| Field | What to Enter | Example |
|-------|--------------|---------|
| **Product Name** | Name of your arrangement | "Sunset Rose Bouquet" |
| **Slug** | Auto-generated, just leave it | "sunset-rose-bouquet" |
| **Price** | Dollar amount (no $ sign) | 49.99 |
| **Stock** | How many you have | 10 |
| **Category** | Pick one: roses, tulips, lilies, mixed | roses |
| **Occasions** | Comma-separated | anniversary, birthday, romance |
| **Description** | What's in it & why it's special | "12 premium sunset roses..." |
| **Image URL** | Photo link (see below) | https://images.unsplash... |
| **Video URL** | Video link (optional) | /videos/sunset-roses.mp4 |

### **Where to Put Images:**

**Option 1: Use Unsplash (Easiest)**
1. Go to https://unsplash.com
2. Search for similar flowers
3. Right-click image → Copy Image Address
4. Paste in "Image URL" field

**Option 2: Upload Your Own**
1. Take photo of your arrangement
2. Save as: `arrangement-name.jpg`
3. Put in: `/Desktop/flower-shop/public/images/`
4. In form, enter: `/images/arrangement-name.jpg`

### **Video (Optional):**
1. Record short video (5-15 seconds)
2. Save as: `arrangement-name.mp4`
3. Put in: `/Desktop/flower-shop/public/videos/`
4. In form, enter: `/videos/arrangement-name.mp4`

---

## **Step 4: Save Product**

Click **"Add Product"** button at bottom.

✅ **Done!** Your arrangement appears on your site instantly!

---

## **Step 5: View Your Product**

Go to: `http://localhost:5173`

Your new arrangement is now live on your homepage! 🎉

---

## 🔄 **To Edit a Product:**

1. Go to: `http://localhost:5173/admin`
2. Find the product in the table
3. Click **"Edit"** button
4. Make changes
5. Click **"Update Product"**

---

## 🗑️ **To Delete a Product:**

1. Go to: `http://localhost:5173/admin`
2. Find the product in the table
3. Click **"Delete"** button
4. Confirm

---

## 📝 **Product Ideas Template:**

**Copy this for each arrangement:**

```
ARRANGEMENT #___

Name: _________________________________
Price: $_______________________________
Description: __________________________
_______________________________________
_______________________________________

Flowers included:
• _____________________________________
• _____________________________________
• _____________________________________

Best for: _____________________________
Occasions: ____________________________
Stock: ________________________________

Photo: [ ] Taken  [ ] Uploaded  [ ] Added
Video: [ ] Taken  [ ] Uploaded  [ ] Added
```

---

## 💡 **Tips:**

### **Good Product Names:**
- "Classic Red Rose Bouquet"
- "Spring Tulip Collection"
- "Elegant White Lily Arrangement"
- "Wildflower Garden Mix"

### **Good Descriptions:**
- Say what flowers are included
- Mention the occasion it's perfect for
- Add size/dimensions
- Keep it 2-3 sentences

### **Categories:**
- **roses** - Any arrangement with roses
- **tulips** - Tulip-focused arrangements
- **lilies** - Lily-focused arrangements
- **mixed** - Everything else

### **Occasions:**
Pick from: anniversary, birthday, romance, valentine, wedding, sympathy, thank-you, just-because, get-well, congratulations

---

## ⚡ **Quick Workflow:**

1. Create arrangement → 2. Take photo → 3. Open admin panel → 4. Fill form → 5. Click Add → **DONE!**

**Each product takes about 2-3 minutes to add!**

---

## 🎯 **Goal:**

Add **8-15 arrangements** before launching.

Take your time and make each one perfect! 🌸

---

## 🆘 **Need Help?**

**Server won't start?**
```bash
cd ~/Desktop/flower-shop
npm install
npm run dev
npm run backend
```

**Can't access admin panel?**
- Make sure both servers are running
- Check: http://localhost:5173/admin

**Photo not showing?**
- Check file is in `public/images/` folder
- Check URL starts with `/images/`
- Refresh page

---

**You're all set! Start adding your beautiful arrangements!** 💐
