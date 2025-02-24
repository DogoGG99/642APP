import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Bill, InsertBill, insertBillSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function BillingPage() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const { data: bills, isLoading } = useQuery<Bill[]>({
    queryKey: ["/api/bills"],
  });

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
  });

  const form = useForm<InsertBill>({
    resolver: zodResolver(insertBillSchema),
    defaultValues: {
      clientId: 0,
      amount: 0,
      status: "pending",
      date: new Date().toISOString(),
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBill) => {
      const res = await apiRequest("POST", "/api/bills", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      setIsOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Bill created successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBill> }) => {
      const res = await apiRequest("PATCH", `/api/bills/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      setIsOpen(false);
      setEditingBill(null);
      form.reset();
      toast({
        title: "Success",
        description: "Bill updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/bills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
      toast({
        title: "Success",
        description: "Bill deleted successfully",
      });
    },
  });

  function onSubmit(data: InsertBill) {
    if (editingBill) {
      updateMutation.mutate({ id: editingBill.id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  const totalAmount = bills?.reduce((sum, bill) => sum + Number(bill.amount), 0) || 0;
  const paidAmount = bills?.reduce(
    (sum, bill) => sum + (bill.status === "paid" ? Number(bill.amount) : 0),
    0,
  ) || 0;
  const pendingAmount = bills?.reduce(
    (sum, bill) => sum + (bill.status === "pending" ? Number(bill.amount) : 0),
    0,
  ) || 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your bills and payments here.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBill ? "Edit Bill" : "Add New Bill"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id.toString()}
                            >
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value.slice(0, 16)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : "Save Bill"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg bg-background">
          <div className="text-sm font-medium text-muted-foreground">
            Total Amount
          </div>
          <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
        </div>
        <div className="p-4 border rounded-lg bg-background">
          <div className="text-sm font-medium text-muted-foreground">
            Paid Amount
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${paidAmount.toFixed(2)}
          </div>
        </div>
        <div className="p-4 border rounded-lg bg-background">
          <div className="text-sm font-medium text-muted-foreground">
            Pending Amount
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            ${pendingAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              bills?.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    {clients?.find((c) => c.id === bill.clientId)?.name}
                  </TableCell>
                  <TableCell>${Number(bill.amount).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{bill.status}</TableCell>
                  <TableCell>{format(new Date(bill.date), "PPpp")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingBill(bill);
                          form.reset(bill);
                          setIsOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (
                            confirm("Are you sure you want to delete this bill?")
                          ) {
                            deleteMutation.mutate(bill.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
