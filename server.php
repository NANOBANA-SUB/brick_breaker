<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $file_name = "scores.json";

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            if(file_exists($file_name)) {
                $json_data = json_decode(file_get_contents($file_name), true);
                // scores �̗�𒊏o
                $scores = array_column($json_data, 'score');
                // scores �̗�Ńf�[�^���~���ɕ��בւ�
                array_multisort($scores, SORT_DESC, $json_data);
                echo json_encode($json_data);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No scores found."));
            }
            break;
        case 'POST':
            // POST���ꂽ�f�[�^���擾
            $data = json_decode(file_get_contents("php://input"));

            if(file_exists($file_name)) {
                // �t�@�C�������݂���ꍇ�͊����̃f�[�^��ǂݍ���
                $json_data = json_decode(file_get_contents($file_name), true);
            } else {
                // �t�@�C�������݂��Ȃ��ꍇ�͐V���Ȕz����쐬
                $json_data = array();
            }

            // �V���ȃX�R�A��ǉ�
            $json_data[] = array('username' => $data->username, 'score' => $data->score);

            // �f�[�^���t�@�C���ɏ�������
            if(file_put_contents($file_name, json_encode($json_data))) {
                // �������X�|���X
                http_response_code(201);
                echo json_encode(array("message" => "Score was inserted."));
            } else {
                // �G���[���X�|���X
                http_response_code(503);
                echo json_encode(array("message" => "Unable to insert score."));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed."));
            break;
    }
?>
