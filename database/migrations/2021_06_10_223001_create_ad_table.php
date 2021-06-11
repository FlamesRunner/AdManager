<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('name');
            $table->unsignedBigInteger('usingMediaId');
            $table->unsignedBigInteger('sectionId');
            $table->foreign('usingMediaId')->references('id')->on('media');
            $table->foreign('sectionId')->references('id')->on('sections');
            $table->timestamp('startingOn');
            $table->integer('duration');
            $table->integer('priority');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ads');
    }
}
