import { addUser, CreateUser, updateUser, User } from "@/api/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const MODE = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  EDIT: "EDIT",
};

function createFormSchema(users: User[]) {
  return z.object({
    name: z
      .string()
      .min(3, "name must be at least 3 characters.")
      .max(15, "name must be at most 15 characters.")
      .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "name can only contain letters.")
      .regex(/^(?!_)(?!.*_$)/, "name cannot start or end with an underscore.")
      .refine((val) => !users.some((u) => u.name === val), {
        message: "name already exists",
      }),
    address: z.string().min(5, {
      message: "name must be at least 2 characters.",
    }),
    phoneNumber: z
      .string()
      .min(10, "Mobile number must be exactly 10 digits.")
      .max(10, "Mobile number must be exactly 10 digits.")
      .regex(
        /^[6789]\d{9}$/,
        "Invalid Indian mobile number. It must start with 6, 7, 8, or 9 and contain only digits."
      ),
    idProof: z.string(),
  });
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

type UserFormProps = {
  selectedUser?: User;
  users: User[];
};

export type UserFormRef = {
  getUserId: () => string | undefined;
};

const UserForm = forwardRef<UserFormRef, UserFormProps>(
  ({ selectedUser, users }, ref) => {
    const [mode, setMode] = useState(selectedUser ? MODE.EDIT : MODE.CREATE);
    const [selectedUserId, setSelectedUserId] = useState(
      selectedUser ? selectedUser.id : ""
    );
    const form = useForm<FormValues>({
      resolver: zodResolver(createFormSchema(users)),
      defaultValues: selectedUser
        ? {
            name: selectedUser.name ?? "",
            address: selectedUser.address ?? "",
            phoneNumber: selectedUser.phoneNumber.toString() ?? "",
            idProof: selectedUser.idProof ?? "",
          }
        : {
            name: "",
            address: "",
            phoneNumber: "",
            idProof: "",
          },
    });
    const {
      register,
      handleSubmit,
      getValues,
      formState: { errors, isDirty },
      trigger,
      setValue,
    } = form;

    useImperativeHandle(ref, () => ({
      getUserId() {
        return selectedUserId;
      },
    }));

    useEffect(() => {
      form.reset(undefined, { keepValues: true });
    }, [users]);

    function handleNewUser() {
      setSelectedUserId("");
      setMode(MODE.CREATE);
      setValue("name", "");
      setValue("phoneNumber", "");
      setValue("idProof", "");
      setValue("address", "");
    }

    const handleUserSelect = (val: string) => {
      const user = users.find((u) => u.id === val);
      if (user) {
        setSelectedUserId(val);
        setMode(MODE.EDIT);
        setValue("name", user.name);
        setValue("phoneNumber", user.phoneNumber.toString());
        setValue("idProof", user.idProof);
        setValue("address", user.address);
      }
    };

    const handlenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue("name", value, { shouldValidate: true });
      trigger("name");
    };

    function onSubmit(values: FormValues) {
      debugger;
      if (mode === MODE.CREATE) {
        const payload: CreateUser = {
          name: values.name,
          idProof: values.idProof,
          address: values.address,
          phoneNumber: parseInt(values.phoneNumber),
        };
        addUser(payload).then((r) => {
          console.log("successfully saved");
          setSelectedUserId(r.id);
          setMode(MODE.EDIT);
        });
      }

      if (mode === MODE.EDIT) {
        const updatePayload: User = {
          id: selectedUserId,
          name: values.name,
          idProof: values.idProof,
          address: values.address,
          phoneNumber: parseInt(values.phoneNumber),
        };
        updateUser(updatePayload).then((r) => {
          console.log("update successfully");
          setSelectedUserId(r.id);
          setMode(MODE.EDIT);
        });
      }
    }

    return (
      <Card className="user__card m-2">
        <CardHeader>
          <CardTitle>User details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <p>dirty - {JSON.stringify(isDirty)}</p>
            <Select onValueChange={handleUserSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button size={"sm"} onClick={handleNewUser}>
              New User
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={handlenameChange}
                          disabled={mode === MODE.EDIT}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Id Proof</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" size={"sm"}>
                {mode === MODE.CREATE ? "Create User" : "Edit User"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
);

export default UserForm;
