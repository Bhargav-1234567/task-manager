"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addContainer } from "@/lib/kanbanSlice";
import { Container } from "@/types";

interface FormValues {
  title: string;
}

export default function AddContainerForm({submitCall=()=>{}}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
const dispatch = useDispatch<AppDispatch>();
  const onSubmit = (data: FormValues) => {
   
    const newContainer: Container = {
      id: `container-${Date.now()}`,
      title: data?.title,
      color: 'gray',
      tasks: [],
    };
submitCall()
    dispatch(addContainer(newContainer));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4 p-6    shadow bg-white dark:bg-gray-900"
    >
      {/* Title Field */}
      <Input
        label="Title"
        placeholder="Enter title"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />

       <Button
        type="submit"
        label={isSubmitting ? "Submitting..." : "Submit"}
        variant="solid"
        color="blue"
        size="md"
        fullWidth
        disabled={isSubmitting}
      />
    </form>
  );
}
