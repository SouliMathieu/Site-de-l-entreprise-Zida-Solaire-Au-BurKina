async function testEmail() {
    const response = await fetch("http://localhost:3000/api/emails/send-order-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: "ZIDA-TEST-001",
        customerEmail: "mathieusouli35@gmail.com", // ← TON EMAIL (celui de Resend)
        customerName: "Mathieu SOULI",
        items: [
          { name: "Panneau Solaire 300W", quantity: 2, price: 50000 },
          { name: "Onduleur 3000W", quantity: 1, price: 80000 },
        ],
        total: 180000,
        deliveryAddress: "123 Avenue Mohammed V, Tanger, Maroc",
      }),
    });
  
    const data = await response.json();
    console.log("Résultat:", data);
  }
  
  testEmail();
  