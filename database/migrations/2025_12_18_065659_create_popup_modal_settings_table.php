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
        Schema::create('popup_modal_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Become a Founder Member');
            $table->text('description')->nullable();
            $table->string('button_text')->default('Join Now');
            $table->string('button_link')->default('/join');
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('popup_modal_settings');
    }
};
