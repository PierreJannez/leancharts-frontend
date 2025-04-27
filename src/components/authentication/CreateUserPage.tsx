import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/services/userService";
import { toast } from "sonner";

const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    id_enterprise: -1,
    enterprise: "",
    id_service: -1,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // 👈 hook pour naviguer

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () =>
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.enterprise.trim() &&
    isEmailValid(form.email) &&
    form.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser(form);
      toast.success("User created successfully!");
      setForm({
        id_enterprise: -1,
        enterprise: "",
        id_service: -1,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      navigate("/"); // 👈 redirection après succès
    } catch (err) {
      console.error(err);
      toast.error("Error while creating the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border rounded bg-white shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create a new user</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="firstName" className="text-base font-medium text-gray-700">
            First name
          </Label>
          <Input
            name="firstName"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-base font-medium text-gray-700">
            Last name
          </Label>
          <Input
            name="lastName"
            placeholder="Enter your last name"
            value={form.lastName}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="enterprise" className="text-base font-medium text-gray-700">
            Company
          </Label>
          <Input
            name="enterprise"
            placeholder="Enter your company name"
            value={form.enterprise}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-base font-medium text-gray-700">
            Email address
          </Label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-base font-medium text-gray-700">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create user"}
        </Button>
      </form>
    </div>
  );
};

export default SignUp;