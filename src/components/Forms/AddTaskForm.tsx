"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addContainer, addTask } from "@/lib/kanbanSlice";
import { Assignee, Container, CreateTaskRequest, ITask } from "@/types";
import { useCreateContainerMutation, useCreateTaskMutation } from "@/lib/api/taskApi";
import Textarea from "../ui/Textarea";

interface FormValues {
  title: string;
  description?:string
}

export default function AddTaskForm({submitCall=()=>{},containerId="",containers=[]}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
const dispatch = useDispatch<AppDispatch>();
   const [addCardApi,{isLoading:cardAdding}]=    useCreateTaskMutation();

  const onSubmit = (data: FormValues) => {
   
    const container = containers.find(c => c.id === containerId);
    console.log({container},'aaaaaaaaaaa')
    const userData:Assignee = JSON.parse( localStorage.getItem('userData')||"")
    const newTask: CreateTaskRequest = {
       title: data.title,
      description: data.description||"",
      priority: 'Normal',
      assignees: [  ],
       status: containers.status,
       containerId:containerId,
      createdBy:userData.id,
      sortIndex:(container.tasks.length||0) 
    };
    addCardApi(newTask).then(task=>{
        console.log({task})
           const newTask: ITask = {
              id: task?.data?._id,
              title:  task?.data?.title,
              description: task?.data?.description,
              priority: task?.data?.priority,
              assignees: task?.data?.assignees,
sortIndex:task?.data?.sortIndex,
              status: task?.data?.status
            };
         dispatch(addTask({containerId:containerId,task:newTask}));
    })
    submitCall()
    // dispatch(addTask({ containerId, task: newTask }));
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

      <Textarea
        label="Description"
        placeholder="Enter description"
        error={errors.description?.message}
        {...register("description"  )}
      />

       <Button
        type="submit"
        label={cardAdding ? "Submitting..." : "Submit"}
        variant="solid"
        color="blue"
        size="md"
        fullWidth
        disabled={cardAdding}
      />
    </form>
  );
}
