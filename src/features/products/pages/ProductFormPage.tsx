import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/shared/page-header";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  fetchTags,
} from "../../../api/products.api";

type ProductTag = {
  id: number;
  name: string;
};

export default function ProductFormPage() {
  const { id: slug } = useParams<{ id: string }>();
  const isEditMode = Boolean(slug);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [existingSlugs, setExistingSlugs] = React.useState<string[]>([]);
  const [availableTags, setAvailableTags] = React.useState<ProductTag[]>([]);
  const [slugError, setSlugError] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "1",
    altText: "",
    tagIds: [] as number[],
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  React.useEffect(() => {
    let isMounted = true;

    fetchProducts().then((res) => {
      if (isMounted && res.data) {
        const slugs = res.data
          .map((p: { slug?: string; id?: string }) => p.slug || p.id)
          .filter((slug): slug is string => Boolean(slug));
        setExistingSlugs(slugs);
      }
    });

    fetchTags().then((tags) => {
      if (isMounted) {
        // Guarantee every tag has a unique ID so they don't all select at once
        const safeTags: ProductTag[] = Array.isArray(tags)
          ? tags.map((t, index) => ({
              id: t.id ?? t.Id ?? index + 1,
              name: t.name || t.Name || `Tag ${index + 1}`,
            }))
          : [];
        setAvailableTags(safeTags);
      }
    });

    if (isEditMode && slug) {
      fetchProductById(slug)
        .then((data) => {
          if (isMounted) {
            setFormData({
              name: data.name,
              brand: data.brand,
              description: data.description,
              price: String(data.price),
              stockQuantity: String(data.stock),
              categoryId: String(data.categoryId || 1),
              altText: data.altText,
              tagIds: Array.isArray(data.tags)
                ? data.tags
                    .map((t: unknown) => {
                      if (typeof t === "object" && t !== null) {
                        const tag = t as { id?: number; Id?: number };
                        return tag.id ?? tag.Id;
                      }
                      return t;
                    })
                    .filter((id): id is number => typeof id === "number")
                : [],
            });
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isEditMode, slug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!isEditMode && name === "name") {
      const generatedSlug = generateSlug(value);
      if (existingSlugs.includes(generatedSlug)) {
        setSlugError(
          `A product with the ID/slug "${generatedSlug}" already exists. Please choose a unique name.`,
        );
      } else {
        setSlugError("");
      }
    }
  };

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError) return;

    // The API requires an image for new products. Catch this before it hits the server.
    if (!isEditMode && !imageFile) {
      alert(
        "Please upload a product image. The database requires an image for new products.",
      );
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("Name", formData.name);
    payload.append("Brand", formData.brand);
    payload.append("Description", formData.description);
    payload.append("Price", formData.price);
    payload.append("StockQuantity", formData.stockQuantity);
    payload.append("CategoryId", formData.categoryId);
    if (formData.altText) payload.append("AltText", formData.altText);

    formData.tagIds.forEach((id) => {
      payload.append("TagIds", String(id));
    });

    if (imageFile) {
      payload.append("Image", imageFile);
    }

    try {
      if (isEditMode && slug) {
        await updateProduct(slug, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/products");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to save product. Check the console for server errors.");
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-muted-foreground animate-pulse text-sm">
        Loading form...
      </div>
    );

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title={isEditMode ? "Edit product" : "Create product"}
          description={
            isEditMode
              ? "Update existing item details"
              : "Add a new item to your grocery catalog"
          }
        />
        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-xs">
          JS
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
      >
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-xs">
            <h3 className="text-lg font-bold mb-6">Basic information</h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product name *
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                  placeholder="e.g. Organic Bananas"
                />
                {slugError && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">
                    {slugError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Brand *
                </label>
                <input
                  required
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                  placeholder="e.g. Freshly"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price ($) *
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Stock quantity *
                </label>
                <input
                  required
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category ID *
                </label>
                <input
                  required
                  type="number"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Image Alt Text
                </label>
                <input
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                  placeholder="A bunch of yellow bananas..."
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Description *
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2.5 rounded-lg border border-input bg-transparent text-sm"
                placeholder="Detailed product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(availableTags) && availableTags.length > 0 ? (
                  availableTags.map((tag) => {
                    const isSelected = formData.tagIds.includes(tag.id);
                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No tags loaded.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
            <h3 className="text-lg font-bold mb-2">Product image</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recommended 1:1 ratio.{" "}
              {isEditMode
                ? "Leave blank to keep current."
                : "Image is required."}
            </p>

            <label className=" w-full h-60 border-2 border-dashed border-border rounded-xl bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition-colors">
              <span className="text-3xl text-primary mb-2">+</span>
              <span className="font-semibold text-sm text-primary">
                Upload image
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PNG or JPG up to 5MB
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
            </label>
            {imageFile && (
              <p className="text-xs text-center mt-3 font-medium truncate text-muted-foreground">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex-1 py-3 bg-transparent border border-input text-foreground text-sm font-semibold rounded-xl hover:bg-accent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Boolean(slugError)}
              className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Saving..." : "Save product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
