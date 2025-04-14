import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/services/userService"
import { toast } from "sonner"

const CreateUserPage: React.FC = () => {
  const [form, setForm] = useState({
    id_enterprise: -1,
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
      console.log("Form data:", form);
      await registerUser(form);
      toast.success("Utilisateur créé avec succès !");
      setForm({ id_enterprise: -1, id_service: -1, firstName: "", lastName: "", email: "", password: "" });
    } catch (err) {
      toast.error("Erreur lors de la création de l'utilisateur.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h1 className="text-xl font-semibold mb-4">Create a user</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First name</Label>
          <Input name="firstName" value={form.firstName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="lastName">Last name</Label>
          <Input name="lastName" value={form.lastName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full">
        Save
        </Button>
      </form>
    </div>
  );
};

export default CreateUserPage;