import React from "react";
import TransactionHistory from "@/components/TransactionHistory";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Transactions: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Le Mie Transazioni</h1>
          <TransactionHistory />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Transactions;