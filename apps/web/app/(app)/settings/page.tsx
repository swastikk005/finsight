"use client"

import { useState } from "react"
import { Settings as SettingsIcon, User, Shield, Bell, Moon, Sun, Globe, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
    const { data: session } = useSession()
    const [currency, setCurrency] = useState("INR")

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                    <SettingsIcon className="h-7 w-7 text-slate-400" />
                    Settings
                </h1>
                <p className="text-slate-500 text-sm mt-0.5 font-medium italic">Manage your account preferences and finance configuration.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 mb-2">
                        <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                                <User className="h-4 w-4 text-emerald-600" />
                            </div>
                            Account Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Full Name</Label>
                                <Input defaultValue={session?.user?.name || ""} className="bg-slate-50 border-slate-200 h-11 rounded-xl font-medium" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Email Address</Label>
                                <Input defaultValue={session?.user?.email || ""} className="bg-slate-50 border-slate-200 h-11 rounded-xl font-medium" readOnly />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 mb-2">
                        <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                            <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100 shadow-sm">
                                <Globe className="h-4 w-4 text-teal-600" />
                            </div>
                            Finance Preferences
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium italic">Configure how your data is displayed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                            <div>
                                <p className="text-sm font-black text-slate-900">Default Currency</p>
                                <p className="text-xs text-slate-400 font-medium italic">The currency used for all charts and reports.</p>
                            </div>
                            <div className="w-[120px]">
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger className="bg-white border-slate-200 h-11 rounded-xl font-black">
                                        <SelectValue placeholder="INR" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 rounded-xl font-black">
                                        <SelectItem value="INR">INR (₹)</SelectItem>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="EUR">EUR (€)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed italic font-medium">
                            <div>
                                <p className="text-sm font-black text-slate-900">Automatic Tax Estimates</p>
                                <p className="text-xs text-slate-400">Enable to see estimated tax deductions in reports.</p>
                            </div>
                            <div className="bg-slate-200 h-6 w-11 rounded-full relative">
                                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-100 bg-red-50/30 overflow-hidden">
                    <CardHeader className="border-b border-red-50 bg-red-50/50 mb-2">
                        <CardTitle className="text-xl font-black text-red-600 tracking-tight">Danger Zone</CardTitle>
                        <CardDescription className="text-red-900/60 font-medium italic">Permanent actions that cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Button variant="destructive" className="bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 font-black h-12 rounded-xl transition-all">
                            Reset All Financial Data
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center pt-8">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-300">FinSight Version 1.0.0 (Production Build)</p>
            </div>
        </div>
    )
}
