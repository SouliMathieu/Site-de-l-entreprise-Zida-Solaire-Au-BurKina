import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Row,
    Column,
  } from "@react-email/components";
  import * as React from "react";
  
  interface OrderConfirmationEmailProps {
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    deliveryAddress: string;
  }
  
  export const OrderConfirmationEmail = ({
    orderNumber = "ZIDA-000000",
    customerName = "Client",
    items = [],
    total = 0,
    deliveryAddress = "Adresse",
  }: OrderConfirmationEmailProps) => (
    <Html>
      <Head />
      <Preview>Votre commande #{orderNumber} a été confirmée - ZIDA SOLAIRE</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>ZIDA SOLAIRE</Heading>
          </Section>
  
          {/* Content */}
          <Section style={content}>
            <Heading as="h2" style={title}>
              Bonjour {customerName},
            </Heading>
            
            <Text style={paragraph}>
              Votre commande <strong>#{orderNumber}</strong> a été confirmée avec succès !
            </Text>
  
            {/* Order Items */}
            <Section style={box}>
              <Heading as="h3" style={subtitle}>
                Détails de la commande
              </Heading>
              
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemName}>{item.name}</Column>
                  <Column style={itemQty}>x{item.quantity}</Column>
                  <Column style={itemPrice}>
                    {item.price.toLocaleString("fr-FR")} FCFA
                  </Column>
                </Row>
              ))}
  
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>TOTAL</Text>
                </Column>
                <Column>
                  <Text style={totalAmount}>
                    {total.toLocaleString("fr-FR")} FCFA
                  </Text>
                </Column>
              </Row>
            </Section>
  
            {/* Delivery Address */}
            <Section style={box}>
              <Heading as="h3" style={subtitle}>
                Adresse de livraison
              </Heading>
              <Text style={paragraph}>{deliveryAddress}</Text>
            </Section>
  
            <Text style={footerText}>
              Nous vous tiendrons informé de l'avancement de votre commande.
            </Text>
  
            <Text style={footerText}>
              Pour toute question, contactez-nous au <strong>+212 XX XX XX XX</strong>
            </Text>
          </Section>
  
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCopyright}>
              © 2026 ZIDA SOLAIRE - Énergie solaire au Maroc
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  export default OrderConfirmationEmail;
  
  // Styles
  const main = {
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  };
  
  const container = {
    margin: "0 auto",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
  };
  
  const header = {
    backgroundColor: "#f97316",
    padding: "20px",
    textAlign: "center" as const,
  };
  
  const headerText = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  };
  
  const content = {
    padding: "20px",
  };
  
  const title = {
    color: "#1f2937",
    fontSize: "20px",
    marginBottom: "10px",
  };
  
  const subtitle = {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "0",
    marginBottom: "15px",
  };
  
  const paragraph = {
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.6",
  };
  
  const box = {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "20px",
    marginBottom: "20px",
  };
  
  const itemRow = {
    borderBottom: "1px solid #e5e7eb",
    paddingTop: "10px",
    paddingBottom: "10px",
  };
  
  const itemName = {
    color: "#1f2937",
    fontSize: "14px",
  };
  
  const itemQty = {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center" as const,
    width: "60px",
  };
  
  const itemPrice = {
    color: "#1f2937",
    fontSize: "14px",
    textAlign: "right" as const,
    fontWeight: "500",
  };
  
  const totalRow = {
    borderTop: "2px solid #e5e7eb",
    paddingTop: "15px",
    marginTop: "10px",
  };
  
  const totalLabel = {
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "bold",
  };
  
  const totalAmount = {
    color: "#f97316",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "right" as const,
  };
  
  const footerText = {
    color: "#6b7280",
    fontSize: "12px",
    marginTop: "20px",
  };
  
  const footer = {
    backgroundColor: "#1f2937",
    padding: "20px",
    textAlign: "center" as const,
  };
  
  const footerCopyright = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0",
  };
  