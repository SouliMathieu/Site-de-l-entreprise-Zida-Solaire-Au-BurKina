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
    Button,
  } from "@react-email/components";
  import * as React from "react";
  
  interface NewOrderAdminEmailProps {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    deliveryAddress: string;
    adminUrl: string;
  }
  
  export const NewOrderAdminEmail = ({
    orderNumber = "ZIDA-000000",
    customerName = "Client",
    customerEmail = "client@example.com",
    customerPhone = "+212 XX XX XX XX",
    items = [],
    total = 0,
    deliveryAddress = "Adresse",
    adminUrl = "http://localhost:3000/admin/commandes",
  }: NewOrderAdminEmailProps) => (
    <Html>
      <Head />
      <Preview>🆕 Nouvelle commande #{orderNumber} - ZIDA SOLAIRE</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>🎉 NOUVELLE COMMANDE</Heading>
          </Section>
  
          {/* Content */}
          <Section style={content}>
            <Heading as="h2" style={title}>
              Commande #{orderNumber}
            </Heading>
            
            <Text style={paragraph}>
              Une nouvelle commande vient d'être passée sur ZIDA SOLAIRE.
            </Text>
  
            {/* Customer Info */}
            <Section style={box}>
              <Heading as="h3" style={subtitle}>
                Informations client
              </Heading>
              <Text style={infoText}>
                <strong>Nom:</strong> {customerName}
              </Text>
              <Text style={infoText}>
                <strong>Email:</strong> {customerEmail}
              </Text>
              <Text style={infoText}>
                <strong>Téléphone:</strong> {customerPhone}
              </Text>
            </Section>
  
            {/* Order Items */}
            <Section style={box}>
              <Heading as="h3" style={subtitle}>
                Produits commandés
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
  
            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={adminUrl}>
                Voir la commande dans l'admin
              </Button>
            </Section>
          </Section>
  
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCopyright}>
              ZIDA SOLAIRE - Panel d'administration
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  export default NewOrderAdminEmail;
  
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
    backgroundColor: "#10b981",
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
  
  const infoText = {
    color: "#4b5563",
    fontSize: "14px",
    margin: "5px 0",
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
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "right" as const,
  };
  
  const buttonContainer = {
    textAlign: "center" as const,
    marginTop: "30px",
  };
  
  const button = {
    backgroundColor: "#f97316",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "12px 30px",
    display: "inline-block",
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
  