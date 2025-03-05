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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PlayCircle, StopCircle } from "lucide-react";

export default function ShiftsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertShift>({
    resolver: zodResolver(insertShiftSchema),
    defaultValues: {
      userId: user?.id,
      startTime: new Date().toISOString(),
      shiftType: 'matutino',
      notes: "",
    },
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const closeShiftMutation = useMutation({
    mutationFn: async (shiftId: number) => {
      const res = await apiRequest("PATCH", `/api/shifts/${shiftId}/close`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al cerrar el turno");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts/active"] });
      // Forzar el estado a null inmediatamente
      queryClient.setQueryData(["/api/shifts/active"], null);

      toast({
        title: "Éxito",
        description: "Turno cerrado exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Actualizar la consulta para que se refresque automáticamente
  const { data: activeShift, isLoading } = useQuery<Shift>({
    queryKey: ["/api/shifts/active"],
    enabled: !!user,
    refetchInterval: 1000, // Refrescar cada segundo
    staleTime: 0, // Considerar los datos obsoletos inmediatamente
    cacheTime: 0, // No cachear los datos
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
                    name="shiftType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Turno</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de turno" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="matutino">Matutino</SelectItem>
                            <SelectItem value="vespertino">Vespertino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              Turno {activeShift.shiftType.charAt(0).toUpperCase() + activeShift.shiftType.slice(1)} Activo
            </CardTitle>
            <Button
              variant="destructive"
              onClick={() => closeShiftMutation.mutate(activeShift.id)}
              disabled={closeShiftMutation.isPending}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              {closeShiftMutation.isPending ? "Cerrando..." : "Cerrar Turno"}
            </Button>
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