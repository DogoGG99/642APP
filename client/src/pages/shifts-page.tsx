import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Shift, InsertShift, insertShiftSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PlayCircle } from "lucide-react";

export default function ShiftsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertShift>({
    resolver: zodResolver(insertShiftSchema),
    defaultValues: {
      userId: user?.id,
      startTime: new Date().toISOString(),
      notes: "",
    },
  });

  const { data: activeShift, isLoading } = useQuery<Shift>({
    queryKey: ["/api/shifts/active"],
    enabled: !!user,
  });

  const openShiftMutation = useMutation({
    mutationFn: async (data: InsertShift) => {
      const res = await apiRequest("POST", "/api/shifts", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al abrir el turno");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts/active"] });
      setIsOpen(false);
      form.reset();
      toast({
        title: "Éxito",
        description: "Turno abierto exitosamente",
      });
    },
    onError: (error: Error) => {
      if (error.message.includes("401")) {
        toast({
          title: "Error",
          description: "Por favor inicia sesión para abrir un turno",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  function onSubmit(data: InsertShift) {
    if (!user) {
      toast({
        title: "Error",
        description: "Por favor inicia sesión para gestionar turnos",
        variant: "destructive",
      });
      return;
    }

    openShiftMutation.mutate(data);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Turnos</h2>
          <p className="text-muted-foreground">
            Gestiona la apertura y cierre de turnos de trabajo.
          </p>
        </div>

        {!activeShift && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlayCircle className="mr-2 h-4 w-4" />
                Abrir Turno
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir Nuevo Turno</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingrese notas adicionales"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={openShiftMutation.isPending}
                  >
                    {openShiftMutation.isPending
                      ? "Abriendo turno..."
                      : "Abrir Turno"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activeShift ? (
        <Card>
          <CardHeader>
            <CardTitle>Turno Activo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Inicio: {new Date(activeShift.startTime).toLocaleString()}</span>
              </div>
              {activeShift.notes && (
                <p className="text-sm text-muted-foreground">{activeShift.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
