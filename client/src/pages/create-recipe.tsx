import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertRecipeSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function CreateRecipe() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm({
    resolver: zodResolver(insertRecipeSchema),
    defaultValues: {
      userId: 1, // Hardcoded for MVP
      title: "",
      ingredients: [],
      instructions: [],
    },
  });

  const createRecipe = useMutation({
    mutationFn: async (values: any) => {
      const formData = new FormData();
      formData.append("userId", values.userId.toString());
      formData.append("title", values.title);
      formData.append("ingredients", JSON.stringify(values.ingredients));
      formData.append("instructions", JSON.stringify(values.instructions));
      if (values.image) {
        formData.append("image", values.image);
      }

      const res = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to create recipe");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipe created!",
        description: "Your recipe has been shared successfully.",
      });
      setLocation("/");
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Recipe</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => createRecipe.mutate(values))} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Recipe name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredients</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter ingredients (one per line)"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.split("\n"))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter instructions (one per line)"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.split("\n"))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={createRecipe.isPending}>
            {createRecipe.isPending ? "Creating..." : "Share Recipe"}
          </Button>
        </form>
      </Form>
    </div>
  );
}