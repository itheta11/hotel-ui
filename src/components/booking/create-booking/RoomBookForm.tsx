import { Bookings } from "@/api/bookings";
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

interface RoomBookProps {
  rooms: Room[];
  bookings: Bookings;
}

const MODE = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  EDIT: "EDIT",
};

const createRoomFormSchema = ({ rooms, bookings }: RoomBookProps) => {
  return z.object({
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

const frameworksList = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember" },
];

const RoomBookForm: React.FC<RoomBookProps> = ({ rooms, bookings }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createRoomFormSchema({ rooms, bookings })),
    defaultValues: {
      totalBill: 0,
      paid: 0,
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    trigger,
    setValue,
    setError,
    clearErrors,
  } = form;

  const [selectedRooms, setSelectedRooms] = useState<string[]>();

  const roomNos = useMemo(() => {
    return rooms.map((x) => {
      return {
        label: "Room" + x.id,
        value: x.id.toString(),
      };
    });
  }, [rooms]);

  function onSubmit(values: FormValues) {
    console.log(values);
  }
  function handleCheckInDate(
    val: Date | undefined,
    field: ControllerRenderProps<
      {
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
                <div className="grid grid-cols-4 gap-4">
                  <MultiSelect
                    className="col-span-2"
                    options={roomNos}
                    onValueChange={setSelectedRooms}
                    defaultValue={selectedRooms}
                    placeholder="Select frameworks"
                    variant="inverted"
                    animation={2}
                    maxCount={3}
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
                              initialFocus
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
                              initialFocus
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
