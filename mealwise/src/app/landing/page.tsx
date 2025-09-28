'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              MealWise
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered meal planning and smart shopping lists. Organize your meals, 
            create shopping lists, and discover new recipes with intelligent assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg border border-amber-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Meal Planning</h3>
            <p className="text-gray-600">
              Get personalized meal suggestions based on your preferences and dietary needs.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg border border-amber-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Shopping Lists</h3>
            <p className="text-gray-600">
              Automatically generate organized shopping lists from your meal plans.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg border border-amber-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Get intelligent help with recipes, substitutions, and meal suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}