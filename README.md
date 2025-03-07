# 📈 Crypto Portfolio Tracker

## 🚀 Overview

Crypto Portfolio Tracker is a React application that allows users to manage their cryptocurrency holdings. Users can add, edit, and delete holdings, view real-time prices, and track historical price changes via charts.

## 📌 Features

### **✅ Core Features**

- 📊 **Portfolio Overview**: Displays all cryptocurrencies in the user's portfolio with:
  - Name, Symbol, Quantity, Current Price, Total Value.
- ➕ **Add Holdings**: Form to add a new cryptocurrency to the portfolio.
- ✏️ **Edit Holdings**: Update existing holdings' quantity.
- 🗑️ **Delete Holdings**: Remove a cryptocurrency from the portfolio (with confirmation).
- 🔍 **Cryptocurrency Details**: View detailed information, including **historical price charts**.

### **🔹 Additional Enhancements**

- 🌍 **Real-time price updates** via API integration.
- 📉 **Price History Chart** powered by Chart.js.
- 🔄 **State Persistence**: Portfolio data is stored locally for persistence.
- ⚡ **Fast and Efficient UI**: Managed via **Redux**.
- ✅ **Input Validation**: Ensures quantity inputs are always positive.
- 🖥️ **Responsive Design**: Optimized for mobile & desktop.

---

## 🏗️ Tech Stack

- **Frontend**: React (Latest Version)
- **State Management**: Redux Toolkit
- **UI Components**: Material UI (MUI)
- **Routing**: React Router
- **Testing**: React Testing Library / Jest
- **Charts**: Chart.js
- **Data Fetching**: Axios
- **Storage**: LocalStorage (for persistence)
- **Backend Proxy**: .NET Core C# API (to secure CoinGecko API calls)

---

## 📥 Installation & Setup

### **🔧 Prerequisites**

Ensure you have **Node.js** and **npm** installed.

### **📦 Clone & Install**

```sh
# Clone the repository
git clone https://github.com/diegofiore83/crypto-portfolio-tracker.git
cd crypto-portfolio-tracker

# Install dependencies
npm install
```

### **▶️ Run the Application**

```sh
npm start
```

- Runs the app in development mode.
- Open **http://localhost:5173/crypto-portfolio-tracker/** to view it in the browser.

### **🧪 Run Tests**

```sh
npm test
```

- Runs unit tests with Jest & React Testing Library.

---

## 🌍 Deployment & API Proxy

The application is deployed on **GitHub Pages** and is available at:
🔗 **[Live Demo](http://diegofiore83.github.io/crypto-portfolio-tracker/)**

### **Backend API Proxy**

To ensure security and mask the API key, a **.NET Core C# API** has been deployed to proxy the requests to the CoinGecko API. The backend is accessible at:
🔗 **[API Swagger Documentation](https://crypto.neapoliswebdigital.com/swagger)**

- The backend acts as a **secure proxy**, preventing direct API key exposure.
- **CORS Restrictions**: Calls are restricted to `localhost` and the **GitHub Pages URL** to enhance security.
- The API handles and forwards all requests to CoinGecko, ensuring safe access to cryptocurrency data.

### **Deployment on GitHub Pages**

To deploy the project on **GitHub Pages**, use:

```sh
npm run build
npm run deploy
```

---

## 🏗️ Project Structure

```sh
crypto-portfolio-tracker/
│── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page views (Portfolio, Crypto Details)
│   ├── store/         # Redux state management
│   │   ├── slices/    # Redux slices for different features
│   │   ├── selectors/ # Memoized selectors for performance
│   │   ├── hooks.ts   # Custom Redux hooks
│   │   ├── store.ts   # Store configuration
│   ├── services/      # API calls
│   ├── theme.js       # MUI Theme
│── public/
│── package.json
│── README.md
```

---

## 📌 Next Steps / Possible Improvements

- 📅 **Filtering & Sorting crypto**
- 💡 **Add User Authentication**
- 🌎 **Multi-language Support**
- 📈 **More Analytics (Profit/Loss, ROI)**
