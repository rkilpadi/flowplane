

    <label> 
      Step Size
      <input
        type="range"
        min=0
        max=0.2
        step=0.01
        bind:value={$settings.step}
        name="step"
      />
    </label>

    <label for="respawnBorderCheckbox">
        Respawn Partciles On the Border
        <input
          type="checkbox"
          id="respawnBorderCheckbox"
          bind:checked={$settings.respawnBorder}
        />
    </label>


