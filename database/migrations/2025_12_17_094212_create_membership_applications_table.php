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
        Schema::create('membership_applications', function (Blueprint $table) {
            $table->id();
            $table->string('membership_type')->nullable();
            $table->string('company_name');
            $table->string('rep_name');
            $table->string('rep_email');
            $table->string('rep_mobile');
            $table->string('rep_designation')->nullable();
            $table->string('company_email')->nullable();
            $table->string('company_mobile')->nullable();
            $table->string('company_whatsapp')->nullable();
            $table->string('company_website')->nullable();
            $table->string('company_logo')->nullable();
            $table->text('company_address')->nullable();
            $table->date('establishment_date')->nullable();
            $table->string('business_segment')->nullable();
            $table->string('product_category')->nullable();
            $table->boolean('export_enabled')->default(false);
            $table->string('payment_method')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_applications');
    }
};
