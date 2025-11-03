# UI Component Library

A comprehensive set of reusable UI components built with TypeScript, Tailwind CSS, and following shadcn/ui patterns.

## Components

### Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger" (default: "primary")
- `size`: "sm" | "md" | "lg" (default: "md")
- `isLoading`: boolean (default: false)
- `disabled`: boolean

**Usage:**
```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md">
  Click me
</Button>

<Button variant="outline" isLoading>
  Loading...
</Button>
```

---

### Input

An input component with label, error states, and icon support.

**Props:**
- `label`: string - Optional label text
- `error`: string - Error message to display
- `helperText`: string - Helper text below input
- `leftIcon`: ReactNode - Icon on the left side
- `rightIcon`: ReactNode - Icon on the right side
- `required`: boolean - Shows asterisk on label

**Usage:**
```tsx
import { Input } from "@/components/ui";
import { Search } from "lucide-react";

<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
  required
/>

<Input
  label="Search"
  leftIcon={<Search className="h-4 w-4" />}
  placeholder="Search jobs..."
/>

<Input
  label="Username"
  error="This username is already taken"
  defaultValue="invalid"
/>
```

---

### Card

A container component with header, content, and footer sections.

**Subcomponents:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title element
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Usage:**
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Job Application</CardTitle>
    <CardDescription>Submit your application</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Application form content...</p>
  </CardContent>
  <CardFooter>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

---

### Badge

A badge component for tags and labels.

**Props:**
- `variant`: "primary" | "secondary" | "success" | "warning" | "danger" | "outline" (default: "primary")
- `size`: "sm" | "md" | "lg" (default: "md")

**Usage:**
```tsx
import { Badge } from "@/components/ui";

<Badge variant="success">Full-time</Badge>
<Badge variant="warning">Remote</Badge>
<Badge variant="outline" size="sm">New</Badge>
```

---

### Select

A dropdown select component with label and error states.

**Props:**
- `label`: string - Optional label text
- `error`: string - Error message
- `helperText`: string - Helper text
- `options`: SelectOption[] - Array of options
- `placeholder`: string - Placeholder text
- `onChange`: (value: string) => void - Change handler
- `required`: boolean

**SelectOption:**
```tsx
{
  value: string;
  label: string;
  disabled?: boolean;
}
```

**Usage:**
```tsx
import { Select } from "@/components/ui";

const [value, setValue] = useState("");

<Select
  label="Job Type"
  placeholder="Select a type"
  value={value}
  onChange={setValue}
  options={[
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
  ]}
/>
```

---

### Dialog

A modal/dialog component with backdrop and keyboard support.

**Subcomponents:**
- `Dialog` - Main wrapper (manages open state)
- `DialogContent` - Content container
- `DialogHeader` - Header section
- `DialogTitle` - Title element
- `DialogDescription` - Description text
- `DialogBody` - Body content
- `DialogFooter` - Footer with actions

**Props:**
- `open`: boolean - Open state
- `onOpenChange`: (open: boolean) => void - State change handler

**Features:**
- Closes on Escape key
- Closes on backdrop click
- Prevents body scroll when open
- Focus trap

**Usage:**
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter
} from "@/components/ui";

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Dialog</Button>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent showClose onClose={() => setOpen(false)}>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed?
      </DialogDescription>
    </DialogHeader>
    <DialogBody>
      <p>Dialog content goes here...</p>
    </DialogBody>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setOpen(false)}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Tabs

A tabs component for organizing content into sections.

**Subcomponents:**
- `Tabs` - Main wrapper (manages active tab)
- `TabsList` - Container for tab triggers
- `TabsTrigger` - Individual tab button
- `TabsContent` - Content for each tab

**Props:**
- `defaultValue`: string - Initial active tab
- `value`: string - Controlled active tab
- `onValueChange`: (value: string) => void - Change handler

**Usage:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

const [tab, setTab] = useState("overview");

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">
    <p>Overview content...</p>
  </TabsContent>

  <TabsContent value="details">
    <p>Details content...</p>
  </TabsContent>

  <TabsContent value="settings">
    <p>Settings content...</p>
  </TabsContent>
</Tabs>
```

---

## Import All Components

All components can be imported from a single entry point:

```tsx
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Select,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
```

## Live Demo

Visit `/components` to see all components in action with interactive examples.

## Styling

All components use Tailwind CSS and support the `className` prop for custom styling. The `cn()` utility function from `@/lib/utils` is used to merge class names.

## TypeScript

All components are fully typed with TypeScript. Import types using:

```tsx
import type { ButtonProps, InputProps, SelectOption } from "@/components/ui";
```

## Accessibility

- All interactive elements support keyboard navigation
- Proper ARIA attributes are used
- Focus management for modals and dialogs
- Screen reader friendly labels
