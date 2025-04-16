import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/services/userService"
import { toast } from "sonner"

const CreateUserPage: React.FC = () => {
  const [form, setForm] = useState({
    id_enterprise: -1,
    enterprise: "",
    id_service: -1,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("Utilisateur créé avec succès !");
      setForm({
        id_enterprise: -1,
        enterprise: "",
        id_service: -1,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (err) {
      toast.error("Erreur lors de la création de l'utilisateur.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border rounded bg-white shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create a user</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="firstName" className="text-base font-medium text-gray-700">First name</Label>
          <Input name="firstName" value={form.firstName} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-base font-medium text-gray-700">Last name</Label>
          <Input name="lastName" value={form.lastName} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="enterprise" className="text-base font-medium text-gray-700">Enterprise</Label>
          <Input name="enterprise" value={form.enterprise} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email" className="text-base font-medium text-gray-700">Email</Label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password" className="text-base font-medium text-gray-700">Password</Label>
          <Input type="password" name="password" value={form.password} onChange={handleChange} className="mt-1" />
        </div>
        <Button type="submit" className="w-full mt-4">
          Save
        </Button>
      </form>
    </div>
  );
};

export default CreateUserPage;