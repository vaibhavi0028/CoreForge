"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Save } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const handleSave = async () => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      toast({ title: "Profile updated!" });
      update();
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) return;

    const res = await fetch("/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPw, newPw }),
    });

    if (res.ok) {
      toast({ title: "Password changed successfully!" });
      setCurrentPw("");
      setNewPw("");
    } else {
      toast({ title: "Password change failed", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="font-display text-3xl font-bold">Profile</h1>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Personal Info</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSave}
              className="gap-2 gradient-bg border-0 text-primary-foreground"
            >
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-3 rounded-xl">
                <Lock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="font-display">Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>
            <Button
              onClick={handleChangePassword}
              variant="outline"
              className="gap-2"
            >
              <Lock className="h-4 w-4" /> Change Password
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full"
        >
          Logout
        </Button>
      </motion.div>
    </div>
  );
}
