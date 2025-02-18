import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertRecipeSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function CreateRecipe() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(insertRecipeSchema),
    defaultValues: {
      title: "",
      ingredients: [],
      instructions: [],
      image: undefined,
    },
  });

  const createRecipe = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create recipe");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/recipes`] });
      toast({
        title: "Recipe created!",
        description: "Your recipe has been shared successfully.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: any) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("userId", user.id.toString());
    formData.append("title", values.title);
    formData.append("ingredients", JSON.stringify(values.ingredients.filter(Boolean)));
    formData.append("instructions", JSON.stringify(values.instructions.filter(Boolean)));

    if (values.image && values.image instanceof File) {
      formData.append("image", values.image);
    }

    createRecipe.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Recipe</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Recipe name" {...field} />
                </FormControl>
                <FormMessage />
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
                    value={field.value?.join("\n") || ""}
                    onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
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
                    value={field.value?.join("\n") || ""}
                    onChange={(e) => field.onChange(e.target.value.split("\n").filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createRecipe.isPending}
          >
            {createRecipe.isPending ? "Creating..." : "Share Recipe"}
          </Button>
        </form>
      </Form>
    </div>
  );
}