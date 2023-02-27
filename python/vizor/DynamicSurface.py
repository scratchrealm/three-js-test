from typing import Tuple, Union
import numpy as np
import figurl as fig


class DynamicSurface:
    def __init__(self, *,
        vertices: np.ndarray,
        faces: np.ndarray,
        num_frames: int,
        scalar_data_type: str,
        scalar_data_uri: str,
        scalar_range: Tuple[float, float]
    ) -> None:
        self.vertices = vertices
        self.faces = faces
        self.num_frames = num_frames
        self.scalar_data_type = scalar_data_type
        self.scalar_data_uri = scalar_data_uri
        self.scalar_range = scalar_range
    def url(self, *, label: str):
        d = {
            'type': 'vizor.DynamicSurface',
            'vertices': self.vertices.astype(np.float32),
            'faces': self.faces.astype(np.int32),
            'numFrames': self.num_frames,
            'scalarDataType': self.scalar_data_type,
            'scalarDataUri': self.scalar_data_uri,
            'scalarRange': [self.scalar_range[0], self.scalar_range[1]]
        }
        F = fig.Figure(
            data=d,
            view_url='https://scratchrealm.github.io/vizor/v1'
        )
        return F.url(label=label)