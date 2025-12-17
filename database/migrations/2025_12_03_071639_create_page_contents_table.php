<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug'); // about, contact, help, stores, faqs, etc.
            $table->string('section_key'); // hero, stats, values, team, etc.
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->json('items')->nullable(); // For arrays like stats, values, team members
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['page_slug', 'section_key']);
            $table->index('page_slug');
        });

        // Create stores table for dynamic store locations
        Schema::create('store_locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('Standard Store'); // Flagship, Premium, Standard, Outlet, Regional
            $table->text('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('hours')->nullable();
            $table->json('features')->nullable(); // Features like Free Parking, Design Consultation, etc.
            $table->boolean('is_open')->default(true);
            $table->decimal('rating', 2, 1)->default(4.5);
            $table->string('map_url')->nullable();
            $table->string('city')->default('Dhaka');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Create FAQ categories table for Help Center and FAQs pages
        Schema::create('faq_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('page_slug')->default('faqs'); // faqs, help
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Create FAQs table
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_category_id')->constrained('faq_categories')->onDelete('cascade');
            $table->string('question');
            $table->text('answer');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Create team members table for About page
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('image')->nullable();
            $table->text('bio')->nullable();
            $table->json('social_links')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('faq_categories');
        Schema::dropIfExists('store_locations');
        Schema::dropIfExists('page_contents');
    }
};
