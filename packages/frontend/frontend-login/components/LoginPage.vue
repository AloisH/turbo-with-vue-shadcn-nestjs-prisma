<script setup lang="ts">
import { Button } from '@heloir/ui/button';
import { Input } from '@heloir/ui/input';
import { Label } from '@heloir/ui/label';
</script>

<template>
  <div class="login-w-full lg:login-grid lg:min-h-[600px] lg:login-grid-cols-2 xl:min-h-[800px] login-h-screen">
    <div class="login-flex login-items-center login-justify-center login-py-12">
      <div class="login-mx-auto login-grid w-[350px] login-gap-6">
        <div class="login-grid login-gap-2 login-text-center">
          <h1 class="login-text-3xl login-font-bold">
            Login
          </h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div class="login-grid login-gap-4">
          <div class="login-grid login-gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="login-grid login-gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" class="login-w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
    <div class="login-hidden bg-muted lg:login-block">
      <img
        src="/placeholder.svg"
        alt="Image"
        width="1920"
        height="1080"
        class="login-h-full login-w-full login-object-cover dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>
