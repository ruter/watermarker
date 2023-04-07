<script lang="ts">
    import { tick } from 'svelte';
    import Uploader from "$lib/components/Uploader.svelte";

    let isUploaded = false;
    let markedImage: string;
    let images: FileList;
    let canvas:HTMLCanvasElement;
    let color = "#FFFFFF";
    let content = "";
    let activeTab = "text";
    let transparent = "50";
    let textSize = "32";
    let tileSpace = "24";

    const imageChanged = () => {
        const ctx = canvas.getContext('2d');
        if (images.length > 0) {
            const image = images[0];

            const img = new Image();
            // get image with & height after loaded
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0, img.width, img.height);
                isUploaded = true;
            };

            const reader = new FileReader();
            reader.onload = (event) => {
                img.src = event.target?.result as string;
                markedImage = img.src;
            }
            reader.readAsDataURL(image);
        }
    }

    const drawText = async () => {
        await tick();

        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        const img = new Image();
        img.src = markedImage;
        img.onload = function() {
            ctx.save();

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = parseInt(transparent) / 100;
            ctx.fillStyle = color;
            ctx.textBaseline = "middle";
            ctx.font = `bold ${textSize}px serif`;

            const textWidth: number = ctx.measureText(content).width;
            const textHeight: number = parseInt(textSize);

            const gap: number = parseInt(tileSpace);

            const rows: number = Math.ceil(canvas.height / (textHeight + gap));
            const cols: number = Math.ceil(canvas.width / (textWidth + gap));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const x: number = j * (textWidth + gap);
                    const y: number = i * (textHeight + gap);
                    ctx.fillText(content, x, y);
                }
            }
            ctx.restore();
        };
    }

    const resetAll = () => {
        color = "#FFFFFF";
        content = "";
        activeTab = "text";
        transparent = "50";
        textSize = "32";
        tileSpace = "24";
    }

    const applyChange = async () => {
        markedImage = canvas.toDataURL();
        resetAll();
    }
</script>

<div>
    <div class="flex justify-center px-2" class:hidden={!isUploaded}>
        <canvas bind:this={canvas} class="bg-white max-w-full"></canvas>
    </div>
    <div class="px-2" class:hidden={isUploaded}>
        <Uploader bind:images on:change={imageChanged} />
    </div>
</div>

<div class="md:hidden" class:hidden={!isUploaded}>
    <div class="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 md:hidden">
        <div class="w-full bg-indigo-600">
            <div
                class="flex justify-between w-full p-4 transition-opacity duration-150 ease-linear"
                class:hidden={activeTab !== "text"}
                id="tabs-text"
                role="tabpanel"
                aria-labelledby="tabs-text-tab">
                <label for="watermarkText" class="p-2 mr-2 bg-indigo-400 rounded">
                    <input
                        bind:value={content}
                        on:change={drawText}
                        type="text"
                        name="watermarkText"
                        id="watermarkText"
                        placeholder="Text Here"
                        class="rounded h-8 px-1 placeholder-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-0 focus:ring-indigo-400" />
                </label>
                <label for="transparent" class="p-2 inline-flex items-center bg-indigo-400 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-1 text-white">
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="mr-2 text-white text-sm">{transparent}%</span>
                    <input
                        type="range"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        min="0"
                        max="100"
                        step="10"
                        bind:value={transparent}
                        on:change={drawText}
                        name="transparent"
                        id="transparent" />
                </label>
            </div>

            <div
                class="flex justify-between w-full p-4 transition-opacity duration-150 ease-linear"
                class:hidden={activeTab !== "font"}
                id="tabs-font"
                role="tabpanel"
                aria-labelledby="tabs-font-tab">
                FONT
            </div>

            <div
                class="flex justify-between space-x-2 w-full p-4 transition-opacity duration-150 ease-linear"
                class:hidden={activeTab !== "style"}
                id="tabs-style"
                role="tabpanel"
                aria-labelledby="tabs-style-tab">
                <div class="inline-flex items-center p-2 bg-indigo-400 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-1 text-white">
                        <path fill-rule="evenodd" d="M16.098 2.598a3.75 3.75 0 113.622 6.275l-1.72.46V12a.75.75 0 01-.22.53l-.75.75a.75.75 0 01-1.06 0l-.97-.97-7.94 7.94a2.56 2.56 0 01-1.81.75 1.06 1.06 0 00-.75.31l-.97.97a.75.75 0 01-1.06 0l-.75-.75a.75.75 0 010-1.06l.97-.97a1.06 1.06 0 00.31-.75c0-.68.27-1.33.75-1.81L11.69 9l-.97-.97a.75.75 0 010-1.06l.75-.75A.75.75 0 0112 6h2.666l.461-1.72c.165-.617.49-1.2.971-1.682zm-3.348 7.463L4.81 18a1.06 1.06 0 00-.31.75c0 .318-.06.63-.172.922a2.56 2.56 0 01.922-.172c.281 0 .551-.112.75-.31l7.94-7.94-1.19-1.19z" clip-rule="evenodd" />
                    </svg>
                    <input
                        id="colorPicker"
                        type="color"
                        bind:value={color}
                        on:change={drawText}
                        class="w-8 h-8 bg-indigo-400" />
                </div>
                <div class="w-full inline-flex items-center p-2 bg-indigo-400 rounded">
                    <div class="inline-flex items-center">
                        <svg class="w-6 h-6 mr-1 text-white" version="1.1" viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path d="m110.83 116.67v-23.336h145.84v373.34h-23.336c-8.3359 0-16.039 4.4453-20.207 11.664s-4.168 16.117 0 23.336 11.871 11.664 20.207 11.664h93.336c8.3359 0 16.039-4.4453 20.207-11.664s4.168-16.117 0-23.336-11.871-11.664-20.207-11.664h-23.336v-373.34h140v23.336c0 8.3359 4.4492 16.039 11.668 20.207s16.113 4.168 23.332 0 11.668-11.871 11.668-20.207v-46.668c0-6.1875-2.457-12.125-6.8359-16.5-4.375-4.375-10.309-6.832-16.496-6.832h-379.17c-6.1875 0-12.125 2.457-16.5 6.832s-6.832 10.312-6.832 16.5v46.668c0 8.3359 4.4453 16.039 11.664 20.207s16.117 4.168 23.336 0 11.664-11.871 11.664-20.207z" style="fill: rgb(255, 255, 255);"></path>
                                <path d="m606.67 256.67h-186.67c-6.1875 0-12.125 2.457-16.5 6.832s-6.832 10.312-6.832 16.5v40.832c0 8.3359 4.4453 16.039 11.664 20.207 7.2188 4.168 16.117 4.168 23.336 0 7.2188-4.168 11.664-11.871 11.664-20.207v-17.5h46.668v163.33h-11.668v0.003907c-8.3359 0-16.039 4.4453-20.207 11.664s-4.168 16.117 0 23.336 11.871 11.664 20.207 11.664h70c8.3359 0 16.039-4.4453 20.207-11.664 4.168-7.2188 4.168-16.117 0-23.336-4.168-7.2188-11.871-11.664-20.207-11.664h-11.664v-163.34h46.668v11.668h-0.003907c0 8.3359 4.4492 16.039 11.668 20.207s16.113 4.168 23.332 0 11.668-11.871 11.668-20.207v-35c0-6.1875-2.457-12.125-6.8359-16.5-4.375-4.375-10.309-6.832-16.496-6.832z" style="fill: rgb(255, 255, 255);"></path>
                            </g>
                        </svg>
                        <span class="mr-2 text-white text-sm">{textSize}px</span>
                    </div>
                    <input
                        type="range"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        min="24"
                        max="88"
                        step="4"
                        bind:value={textSize}
                        on:change={drawText}
                        name="textSize"
                        id="textSize" />
                </div>
            </div>

            <div
                class="flex justify-between w-full p-4 transition-opacity duration-150 ease-linear"
                class:hidden={activeTab !== "tile"}
                id="tabs-tile"
                role="tabpanel"
                aria-labelledby="tabs-tile-tab">
                <div class="w-full inline-flex items-center p-2 bg-indigo-400 rounded">
                    <div class="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-1 text-white">
                            <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
                        </svg>
                        <span class="mr-2 text-white text-sm">{tileSpace}px</span>
                    </div>
                    <input
                        type="range"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        min="0"
                        max="100"
                        step="1"
                        bind:value={tileSpace}
                        on:change={drawText}
                        name="tileSpace"
                        id="tileSpace" />
                </div>
            </div>
        </div>
        <ul class="flex justify-center text-sm font-medium text-center text-gray-500">
            <li class="w-auto">
                <button
                    type="button"
                    on:click={() => {
                        resetAll();
                        drawText();
                    }}
                    class="text-2xl shadow w-12 h-full flex items-center justify-center bg-gray-600 text-white opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>
                </button>
            </li>
            <li class="w-full">
                <a href="#text" on:click={() => activeTab = "text"} class="w-full inline-flex justify-center p-4 border-t-2 {activeTab === 'text' ? 'text-white bg-indigo-600 border-indigo-600' : 'border-transparent'}">
                    <svg aria-hidden="true" class="w-5 h-5 mr-1 {activeTab === 'text' ? 'text-white' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clip-rule="evenodd" />
                    </svg>
                    <span>TEXT</span>
                </a>
            </li>
            <!-- <li class="w-full">
                <a href="#font" on:click={() => activeTab = "font"} class="w-full inline-flex justify-center p-4 border-t-2 {activeTab === 'font' ? 'text-white bg-indigo-600 border-indigo-600' : 'border-transparent'}">
                    <svg aria-hidden="true" class="w-5 h-5 mr-1 hover:text-gray-500 {activeTab === 'font' ? 'text-white' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>FONT
                </a>
            </li> -->
            <li class="w-full">
                <a href="#style" on:click={() => activeTab = "style"} class="w-full inline-flex justify-center p-4 border-t-2 {activeTab === 'style' ? 'text-white bg-indigo-600 border-indigo-600' : 'border-transparent'}">
                    <svg aria-hidden="true" class="w-5 h-5 mr-1 {activeTab === 'style' ? 'text-white' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.896-1.207 8.026 8.026 0 00-4.513-4.513A18.75 18.75 0 008.475 11.7l-.278.5a5.26 5.26 0 013.601 3.602l.502-.278zM6.75 13.5A3.75 3.75 0 003 17.25a1.5 1.5 0 01-1.601 1.497.75.75 0 00-.7 1.123 5.25 5.25 0 009.8-2.62 3.75 3.75 0 00-3.75-3.75z" clip-rule="evenodd" />
                    </svg>
                    <span>STYLE</span>
                </a>
            </li>
            <li class="w-full">
                <a href="#tile" on:click={() => activeTab = "tile"} class="w-full inline-flex justify-center p-4 border-t-2 {activeTab === 'tile' ? 'text-white bg-indigo-600 border-indigo-600' : 'border-transparent'}">
                    <svg aria-hidden="true" class="w-5 h-5 mr-1 {activeTab === 'tile' ? 'text-white' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
                    </svg>
                    <span>TILE</span>
                </a>
            </li>
            <li class="w-auto">
                <button
                    type="button"
                    on:click={applyChange}
                    class="text-2xl shadow w-12 h-full flex items-center justify-center bg-gray-600 text-white opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                    </svg>
                </button>
            </li>
        </ul>
    </div>
</div>
 