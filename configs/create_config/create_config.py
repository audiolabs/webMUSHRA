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

intro = "Thank you for participating in our experiment!<br/><br/>This experiment will take about an hour.<br/><br/>We are going to ask you to rate five slightly different versions of a clip from one of our shows for dialogue clarity. You can take as long as you like on each clip, there will be fifteen in total. You will be asked whether the version is better or worse than a reference clip. The first clip is for practise, to get used to the interface. After the first clip, the experiment will begin.<br/><br/>"

question = "How does the speech clarity of each version of the broadcast clip compare to the reference?"

instructions = "In each vertical column is a different version of a clip from a BBC programme. For this programme clip, please rank each dialogue clarity of each version against the reference clip, avoiding comparing the versions to eachother. You can listen to each clip and version as many times as you like, and choose to loop a part of it to focus on a shorter section of the clip. "


for i, group in enumerate([group1, group2]):
    # Read the YAML file as text
    head = f"""testname: Improving dialogue clarity in BBC programmes
testId: dialogue_enhancement_{i+1}
bufferSize: 2048
stopOnErrors: true
showButtonPreviousPage: true
remoteService: service/write.php


pages:
    - type: generic
      id: first_page
      name: Welcome
      content: You are in group {i+1}<p></p>{intro}
    - type: headphones
      content: Hello world
    - type: consent
      id: consent_page
      name: Consent
      mustConsent: true
      content: Do you consent to having your brains harvested in the name of science?
"""

    yaml_text = head

    training_clip = training.new.values[0]

    yaml_text += f"""
    - type: mushra
      id: training
      name: {question}
      content: <b>This is a training example! Take as long as you like to familiarise yourself with the interface.</b><br></br>{instructions}
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
          name: {question}
          content: {instructions}
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
