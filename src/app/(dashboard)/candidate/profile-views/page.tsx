"use client";

import { Eye, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function ProfileViewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Views</h1>
          <p className="text-gray-600">
            Track who's viewing your profile and how you're being discovered
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-purple-900">0</p>
                </div>
                <Eye className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">This Week</p>
                  <p className="text-3xl font-bold text-blue-900">0</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">Unique Viewers</p>
                  <p className="text-3xl font-bold text-green-900">0</p>
                </div>
                <Users className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium mb-1">Trend</p>
                  <p className="text-3xl font-bold text-orange-900">--</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Message */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 mb-6">
              <Eye className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Views Tracking Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We're building a comprehensive profile views tracking system that will show you:
            </p>
            <div className="grid gap-4 text-left max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Who viewed your profile</p>
                  <p className="text-sm text-gray-600">
                    See which employers and recruiters are checking out your profile
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">View analytics over time</p>
                  <p className="text-sm text-gray-600">
                    Track trends in your profile visibility and popularity
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Source of discovery</p>
                  <p className="text-sm text-gray-600">
                    Understand how employers are finding you (search, recommendations, etc.)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Action insights</p>
                  <p className="text-sm text-gray-600">
                    See which views led to interview invites or job offers
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" size="lg" className="mb-4">
              Feature in Development
            </Badge>
            <p className="text-sm text-gray-500">
              In the meantime, keep your profile up-to-date to maximize visibility
            </p>
            <div className="mt-8">
              <Link
                href="/candidate/profile"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                Update Your Profile
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
