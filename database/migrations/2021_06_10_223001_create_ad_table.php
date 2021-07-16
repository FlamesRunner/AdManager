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
            $table->string('name')->unique();
            $table->unsignedBigInteger('usingMediaId');
            $table->unsignedBigInteger('sectionId');
            $table->foreign('usingMediaId')->references('id')->on('media');
            $table->foreign('sectionId')->references('id')->on('sections');
            $table->integer('startingOn');
            $table->integer('endingOn');
            $table->integer('priority');
            $table->string('tagLine');
            $table->string('url');
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
