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
        Schema::create('partnerships', function (Blueprint $table) {
            $table->id();
            $table->string('partner_name');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description');
            $table->string('logo')->nullable();
            $table->string('type')->nullable(); // e.g., 'corporate', 'educational', 'government', 'ngo'
            $table->string('industry')->nullable();
            $table->string('website_url')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->date('partnership_start_date')->nullable();
            $table->date('partnership_end_date')->nullable();
            $table->string('status')->default('active'); // active, inactive, pending
            $table->json('benefits')->nullable(); // Array of partnership benefits
            $table->json('joint_projects')->nullable(); // Array of joint project names/ids
            $table->text('partnership_details')->nullable();
            $table->string('mou_document')->nullable(); // MOU/agreement document path
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('type');
            $table->index('status');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partnerships');
    }
};
