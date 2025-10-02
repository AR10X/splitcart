# 🛒 SplitCart

A collaborative cart application where multiple people can join a shared cart, add items, and split fees fairly.  
Built with **React, Firebase, and TailwindCSS**.

---

## 🚀 Features

- **Authentication (Firebase Phone Auth)** – login using test numbers.  
- **Create / Join Cart** – generate a cart code and share with others.  
- **Shared Cart** – every member can add their own items in real-time.  
- **Automatic Split** – fees are divided equally across members.  
- **Order Tracking** – checkout creates an order record with status.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** Firebase Auth + Firestore  
- **Hosting:** Vercel  

---

## 📸 Screenshots

### Landing Page
![Landing Page](docs/landing.jpg)

### Collaborative Cart
![Cart Page](docs/cart.jpg)

### Orders
![Orders Page](docs/orders.jpg)

---

## ⚡ How It Works

1. User logs in with a phone number (Firebase test numbers).  
2. One user creates a new cart → gets a cart code.  
3. Other users join using the code.  
4. Members add items → cart syncs in real-time.  
5. Checkout splits fees and creates an order record.

---

## 📂 Project Status

The project is complete as an **MVP implementation** with working flows for create/join cart, item sync, and checkout.
