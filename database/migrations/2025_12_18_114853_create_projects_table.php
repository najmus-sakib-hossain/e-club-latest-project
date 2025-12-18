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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description');
            $table->string('image')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('category')->nullable(); // e.g., 'social-enterprise', 'innovation', 'community'
            $table->string('status')->default('ongoing'); // ongoing, completed, planned
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('location')->nullable();
            $table->json('partners')->nullable(); // Array of partner names/organizations
            $table->string('project_lead')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('website_url')->nullable();
            $table->json('gallery')->nullable(); // Array of image URLs
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('status');
            $table->index('is_featured');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
