import {
  Booking,
  Bookings,
  createBooking,
  CreateBooking,
  updateBooking,
} from "@/api/bookings";
import { Room } from "@/api/rooms";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDatetime } from "@/components/ui/calendar-datetime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { compareAsc, compareDesc, format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEventHandler, useMemo, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { setHours, setMinutes } from "date-fns";
import { Input } from "@/components/ui/input";
import { MultiSelect, MultiSelectProps } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";

const MODE = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  EDIT: "EDIT",
};

const createRoomFormSchema = ({
  rooms,
  bookings,
}: {
  rooms: Room[];
  bookings: Bookings;
}) => {
  return z.object({
    rooms: z
      .number()
      .array()
      .refine((val) => val.length > 0, { message: "Must select a room" }),
    checkIn: z.date({
      required_error: "Check In date is required.",
    }),
    checkOut: z.date({
      required_error: "Check out date is required.",
    }),
    totalBill: z.number({
      required_error: "Total Bill is required",
    }),
    paid: z.number({
      required_error: "Total Bill is required",
    }),
  });
};

type FormValues = z.infer<ReturnType<typeof createRoomFormSchema>>;

interface RoomBookProps {
  mode: string;
  bookingId?: string;
  selectedBooking?: Booking;
  rooms: Room[];
  bookings: Bookings;
  getUserId: () => string | undefined;
  onClose: () => void;
}

const RoomBookForm: React.FC<RoomBookProps> = ({
  mode,
  bookingId,
  selectedBooking,
  rooms,
  bookings,
  getUserId,
  onClose,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createRoomFormSchema({ rooms, bookings })),
    defaultValues: selectedBooking
      ? {
          rooms: selectedBooking.rooms.map((r) => Number(r.id)) ?? [],
          checkIn: new Date(selectedBooking.checkIn) ?? new Date(),
          checkOut: new Date(selectedBooking.checkOut) ?? new Date(),
          totalBill: selectedBooking.totalBill ?? 0,
          paid: selectedBooking.advanceAmount ?? 0,
        }
      : {
          totalBill: 0,
          paid: 0,
          rooms: [],
          checkIn: new Date(),
          checkOut: new Date(),
        },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
    trigger,
    setValue,
    setError,
    clearErrors,
  } = form;

  const { toast } = useToast();

  const roomNos = useMemo(() => {
    return rooms.map((x) => {
      return {
        label: "Room" + x.id,
        value: x.id.toString(),
      };
    });
  }, [rooms]);

  function handleCheckInDate(
    val: Date | undefined,
    field: ControllerRenderProps<
      {
        rooms: number[];
        checkIn: Date;
        checkOut: Date;
        totalBill: number;
        paid: number;
      },
      "checkIn"
    >
  ): void {
    const { checkOut } = getValues();
    if (val && checkOut) {
      const isInvalid = compareDesc(val, checkOut);
      if (isInvalid !== 1) {
        setError("checkIn", {
          type: "validate",
          message: "Check in cannot be more than check out",
        });
      } else {
        clearErrors("checkIn");
      }
    }
    field.onChange(val);
  }

  function handleCheckOutDate(
    val: Date | undefined,
    field: ControllerRenderProps<
      {
        rooms: number[];
        checkIn: Date;
        checkOut: Date;
        totalBill: number;
        paid: number;
      },
      "checkOut"
    >
  ): void {
    const { checkIn } = getValues();
    if (val && checkIn) {
      const isInvalid = compareDesc(checkIn, val);
      if (isInvalid !== 1) {
        setError("checkOut", {
          type: "validate",
          message: "Check out cannot be less than check in",
        });
      } else {
        clearErrors("checkOut");
      }
    }
    field.onChange(val);
  }
  function onSubmit(values: FormValues) {
    debugger;
    const userId = getUserId();
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Select a user",
        duration: 1000,
      });
      return;
    }

    const payload: CreateBooking = {
      checkIn: formatISO(values.checkIn).split("+")[0],
      checkOut: formatISO(values.checkOut).split("+")[0],
      totalBill: values.totalBill,
      advanceAmount: values.paid,
      roomIds: values.rooms,
      userId,
    };
    if (mode === MODE.CREATE) {
      createBooking(payload).then((r) => {
        console.log("booking created successfully");
        toast({
          variant: "default",
          title: "Booking successfully created",
          duration: 1000,
        });
      });
    } else if (mode === MODE.EDIT && bookingId) {
      updateBooking(bookingId, payload).then((r) => {
        console.log("booking updated successfully");
        toast({
          variant: "default",
          title: "Booking updated created",
          duration: 1000,
        });
      });
    }
    onClose();
  }
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Room</CardTitle>
        <CardContent>
          <div className="my-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <p>dirty - {JSON.stringify(isDirty)}</p>
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Select a room</FormLabel>
                        <FormControl>
                          <MultiSelect
                            className="col-span-2"
                            options={roomNos}
                            defaultValue={field.value?.map((x) => x.toString())}
                            onValueChange={(val) => {
                              debugger;
                              field.onChange(
                                val ? val.map((v) => Number(v)) : []
                              );
                            }}
                            placeholder="Select a room"
                            variant="inverted"
                            animation={2}
                            maxCount={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex flex-col">
                        <FormLabel>Check In</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "do, MMM yyyy HH : mm")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarDatetime
                              mode="single"
                              selected={field.value}
                              onSelectedDatetime={(val) =>
                                handleCheckInDate(val, field)
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex flex-col">
                        <FormLabel>CHeck Out</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "do, MMM yyyy HH : mm")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarDatetime
                              mode="single"
                              selected={field.value}
                              onSelectedDatetime={(val) =>
                                handleCheckOutDate(val, field)
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalBill"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Total Bill</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : ""
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paid"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Paid</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : ""
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default RoomBookForm;
