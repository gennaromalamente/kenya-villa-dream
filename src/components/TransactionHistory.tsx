import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_provider: string;
  status: string;
  created_at: string;
  booking_id: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, label: "In Attesa" },
      completed: { variant: "default" as const, label: "Completato" },
      failed: { variant: "destructive" as const, label: "Fallito" },
      cancelled: { variant: "outline" as const, label: "Annullato" }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string, provider: string) => {
    const methodMap = {
      stripe: "Carta di Credito",
      paypal: "PayPal",
      bank_transfer: "Bonifico",
      crypto: "Criptovalute"
    };
    return methodMap[method as keyof typeof methodMap] || provider || method;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storico Transazioni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storico Transazioni</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nessuna transazione trovata
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Importo</TableHead>
                  <TableHead>Metodo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Prenotazione</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm", { locale: it })}
                    </TableCell>
                    <TableCell className="font-medium">
                      €{transaction.amount.toFixed(2)} {transaction.currency}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodLabel(transaction.payment_method, transaction.payment_provider)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.booking_id?.slice(0, 8)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;