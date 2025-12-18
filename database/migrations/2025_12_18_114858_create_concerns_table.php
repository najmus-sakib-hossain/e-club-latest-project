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
        Schema::create('concerns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description');
            $table->string('icon')->nullable(); // Icon class or image URL
            $table->string('category')->nullable(); // e.g., 'policy', 'advocacy', 'entrepreneurship', 'regulatory'
            $table->string('status')->default('active'); // active, resolved, ongoing
            $table->string('priority')->default('medium'); // low, medium, high, critical
            $table->date('raised_date')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_email')->nullable();
            $table->json('related_links')->nullable(); // Array of related documents/articles
            $table->json('affected_sectors')->nullable(); // Array of business sectors affected
            $table->text('proposed_solution')->nullable();
            $table->text('current_status_update')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('status');
            $table->index('priority');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concerns');
    }
};
