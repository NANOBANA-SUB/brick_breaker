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
                // scores の列を抽出
                $scores = array_column($json_data, 'score');
                // scores の列でデータを降順に並べ替え
                array_multisort($scores, SORT_DESC, $json_data);
                echo json_encode($json_data);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No scores found."));
            }
            break;
        case 'POST':
            // POSTされたデータを取得
            $data = json_decode(file_get_contents("php://input"));

            if(file_exists($file_name)) {
                // ファイルが存在する場合は既存のデータを読み込む
                $json_data = json_decode(file_get_contents($file_name), true);
            } else {
                // ファイルが存在しない場合は新たな配列を作成
                $json_data = array();
            }

            // 新たなスコアを追加
            $json_data[] = array('username' => $data->username, 'score' => $data->score);

            // データをファイルに書き込む
            if(file_put_contents($file_name, json_encode($json_data))) {
                // 成功レスポンス
                http_response_code(201);
                echo json_encode(array("message" => "Score was inserted."));
            } else {
                // エラーレスポンス
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
