"use client";

import { useState } from "react";
import { Search, Mail, User } from "lucide-react";
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

export default function ComponentsShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectValue, setSelectValue] = useState("");

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">UI Components Showcase</h1>
        <p className="text-lg text-secondary-600">
          A comprehensive set of reusable UI components for the Job Portal
        </p>
      </div>

      <div className="space-y-12">
        {/* Buttons Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Buttons</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-secondary-700">
                    Variants
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-secondary-700">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-secondary-700">
                    States
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled>Disabled</Button>
                    <Button isLoading>Loading</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Inputs</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Input label="Basic Input" placeholder="Enter text..." />
                <Input
                  label="Required Input"
                  placeholder="Required field"
                  required
                />
                <Input
                  label="With Helper Text"
                  placeholder="Username"
                  helperText="Choose a unique username"
                />
                <Input
                  label="With Error"
                  placeholder="Email"
                  error="This email is already taken"
                  defaultValue="invalid@email"
                />
                <Input
                  label="With Left Icon"
                  placeholder="Search..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
                <Input
                  label="With Right Icon"
                  placeholder="Email"
                  type="email"
                  rightIcon={<Mail className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Select Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Select</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Select
                  label="Job Type"
                  placeholder="Select a job type"
                  value={selectValue}
                  onChange={setSelectValue}
                  options={[
                    { value: "full-time", label: "Full-time" },
                    { value: "part-time", label: "Part-time" },
                    { value: "contract", label: "Contract" },
                    { value: "internship", label: "Internship" },
                  ]}
                />
                <Select
                  label="Experience Level"
                  placeholder="Select experience"
                  helperText="Choose your experience level"
                  options={[
                    { value: "entry", label: "Entry Level" },
                    { value: "mid", label: "Mid Level" },
                    { value: "senior", label: "Senior Level" },
                    { value: "lead", label: "Lead" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Badges</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-secondary-700">
                    Variants
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-secondary-700">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Cards</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>
                  This is a simple card with header and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary-600">
                  Card content goes here. You can add any elements inside the
                  card content area.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Card with action buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-secondary-600">
                  This card includes a footer with action buttons.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Tabs Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Tabs</h2>
          <Card>
            <CardContent className="pt-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="rounded-md border border-secondary-200 p-4">
                    <h3 className="mb-2 font-medium">Overview Tab</h3>
                    <p className="text-sm text-secondary-600">
                      This is the overview tab content. Switch between tabs to
                      see different content.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="rounded-md border border-secondary-200 p-4">
                    <h3 className="mb-2 font-medium">Details Tab</h3>
                    <p className="text-sm text-secondary-600">
                      Detailed information goes here in the details tab.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="rounded-md border border-secondary-200 p-4">
                    <h3 className="mb-2 font-medium">Settings Tab</h3>
                    <p className="text-sm text-secondary-600">
                      Configure your settings in this tab.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Dialog Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Dialog / Modal</h2>
          <Card>
            <CardContent className="pt-6">
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent
                  showClose
                  onClose={() => setDialogOpen(false)}
                >
                  <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to proceed with this action?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogBody>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        leftIcon={<User className="h-4 w-4" />}
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        leftIcon={<Mail className="h-4 w-4" />}
                      />
                    </div>
                  </DialogBody>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>

        {/* Usage Example */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Usage Example</h2>
          <Card>
            <CardHeader>
              <CardTitle>Import Components</CardTitle>
              <CardDescription>
                All components can be imported from a single entry point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-secondary-900 p-4 text-sm text-white">
                <code>{`import {
  Button,
  Input,
  Card,
  Badge,
  Select,
  Dialog,
  Tabs,
} from "@/components/ui";`}</code>
              </pre>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
