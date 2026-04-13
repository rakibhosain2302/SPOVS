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
        Schema::create('order_wise_item_verifies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('item_id');
            $table->integer('item_quantity');
            $table->decimal('item_price', 10, 2);
            $table->string('item_name');
            $table->string('item_verifier_by')->nullable();
            $table->timestamp('item_verified_at');
            $table->timestamp('purchased_at');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('order_items')->onDelete('cascade');
            $table->index(['order_id', 'item_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_wise_item_verifies');
    }
};
