import os
import glob
import numpy as np
import pandas as pd

# Get the list of .wav files
wav_files = glob.glob("../../stimuli/*.wav")

clip_names_csv = "../../../utils/clip_names_map.csv"


# Two groups
df = pd.read_csv(clip_names_csv, index_col=0)
group1 = df[df.group == 1]
group2 = df[df.group == 2]
training = df[df.group == 0]


for group in [group1, group2]:
    # Read the YAML file as text
    with open("before.yaml", "r") as file:
        yaml_text = file.read()

    training_clip = training.new.values[0]

    yaml_text += f"""
    - type: mushra
      id: training
      name: MUSHRA
      content: Training example
      showWaveform: true
      enableLooping: true
      randomize: false
      reference: stimuli/{training_clip}-mix.wav
      stimuli:
          C1: stimuli/{training_clip}-mix-hf-n.wav
          C2: stimuli/{training_clip}-remix-orig-hf-n.wav
          C3: stimuli/{training_clip}-remix-bss-htdft-hf-n.wav
          C4: stimuli/{training_clip}-remix-bss-cfk-hf-n.wav
    """

    yaml_text += """
    -
        - random"""

    for i, clipname in enumerate(group.new):
        print(f"{i} Group{np.unique(group.group)[0]} {clipname}")
        experiment_page = f"""
        - type: mushra
          id: trial_{i+1}_{clipname}
          name: Clip {i+1}
          content: How does the speech clarity of these clips compare to the reference ?
          reference: stimuli/{clipname}-mix.wav
          stimuli:
            C1: stimuli/{clipname}-mix-hf-n.wav
            C2: stimuli/{clipname}-remix-orig-hf-n.wav
            C3: stimuli/{clipname}-remix-bss-htdft-hf-n.wav
            C4: stimuli/{clipname}-remix-bss-cfk-hf-n.wav
          enableLooping: true
          randomize: true
    """
        # break
        yaml_text += experiment_page

    # Read the YAML file as text
    with open("after.yaml", "r") as file:
        after_text = file.read()

    yaml_text += after_text

    with open(f"../group_{np.unique(group.group)[0]}.yaml", "w") as file:
        file.write(yaml_text)
