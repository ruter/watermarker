<script lang="ts">
  import "../app.css";
</script>

<svelte:head>
  <title>Watermarker</title>
</svelte:head>

<div class="min-h-full">
  <nav class="bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-24" src="./logo.svg" alt="小水印">
          </div>
        </div>
      </div>
    </div>
  </nav>

  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>
</div>
